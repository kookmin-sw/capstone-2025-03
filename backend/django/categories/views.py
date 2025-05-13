from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Category
from .serializers import CategorySerializer, PreviewCategorySerializer
from products.models import Product
import random


@method_decorator(cache_page(60 * 60), name='get')  # 리스트 조회(GET) 1시간 캐시
class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.all().prefetch_related('industries')
        industries = self.request.query_params.get("industry_id", None)
        if industries:
            industry_ids = [int(i) for i in industries.split(",")]
            queryset = queryset.filter(industries__id__in=industry_ids)
        return queryset


@method_decorator(cache_page(60 * 10), name='get')  # 상세 조회(GET) 10분 캐시
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all().prefetch_related('industries')
    serializer_class = CategorySerializer


class RandomCategoryPreview(APIView):
    def post(self, request):
        exclude_ids = request.data.get("exclude_category_ids", [])
        # 핫카테고리 ID 목록 캐시
        cache_key = 'eligible_category_ids'
        eligible_cat_ids = cache.get(cache_key)
        if eligible_cat_ids is None:
            eligible_cat_ids = list(
                Category.objects
                        .exclude(id__in=exclude_ids)
                        .annotate(product_count=Count('products'))
                        .filter(product_count__gt=5)
                        .values_list('id', flat=True)
            )
            cache.set(cache_key, eligible_cat_ids, timeout=60 * 5)
        # 제외 ID 필터링
        eligible_cat_ids = [cid for cid in eligible_cat_ids if cid not in exclude_ids]

        chosen_cat_ids = random.sample(eligible_cat_ids, min(5, len(eligible_cat_ids)))
        cats = Category.objects.filter(id__in=chosen_cat_ids).only('id', 'name')

        result = []
        for cat in cats:
            prod_cache_key = f'prod_ids_cat_{cat.id}'
            prod_ids = cache.get(prod_cache_key)
            if prod_ids is None:
                prod_ids = list(
                    Product.objects
                           .filter(category=cat)
                           .values_list('id', flat=True)
                )
                cache.set(prod_cache_key, prod_ids, timeout=60 * 5)
            sample_ids = random.sample(prod_ids, min(5, len(prod_ids)))

            products = Product.objects.filter(id__in=sample_ids).only(
                'id', 'name', 'grade', 'price', 'images'
            )
            preview_items = [
                {
                    'id':        p.id,
                    'name':      p.name,
                    'grade':     p.grade,
                    'price':     p.price,
                    'thumbnail': (p.images[0] if p.images else None),
                }
                for p in products
            ]
            result.append({
                'id':    cat.id,
                'name':  cat.name,
                'items': preview_items,
            })

        serializer = PreviewCategorySerializer(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryProductsExcludeBodyView(APIView):
    def post(self, request):
        category_id = request.data.get("category_id")
        exclude_ids = request.data.get("exclude_product_ids", [])

        if not category_id:
            return Response(
                {"detail": "category_id를 입력해주세요."},
                status=status.HTTP_400_BAD_REQUEST
            )
        category = get_object_or_404(Category, id=category_id)

        cache_key = f'prod_ids_excl_cat_{category.id}'
        prod_ids = cache.get(cache_key)
        if prod_ids is None:
            prod_ids = list(
                Product.objects
                       .filter(category=category)
                       .exclude(id__in=exclude_ids)
                       .values_list('id', flat=True)
            )
            cache.set(cache_key, prod_ids, timeout=60 * 5)
        else:
            prod_ids = [pid for pid in prod_ids if pid not in exclude_ids]

        sample_count = min(4, len(prod_ids))
        sampled_ids = random.sample(prod_ids, sample_count) if sample_count > 0 else []

        products_qs = Product.objects.filter(id__in=sampled_ids).only(
            'id', 'name', 'grade', 'price', 'images'
        )
        items = [
            {
                'id':        p.id,
                'name':      p.name,
                'grade':     p.grade,
                'price':     p.price,
                'thumbnail': p.images[0] if p.images else None,
            }
            for p in products_qs
        ]

        return Response({
            'category_id':   category.id,
            'category_name': category.name,
            'products':      items,
        }, status=status.HTTP_200_OK)
