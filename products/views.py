from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from .pagination import LargeResultsSetPagination  # 100개씩 페이지네이션 적용

# ✅ 1. 전체 상품 조회 및 생성 (ListCreateAPIView) + 필터링 & 정렬 + 페이지네이션 적용
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.OrderingFilter]  # 정렬 추가
    ordering_fields = ['sales_status', 'price']
    pagination_class = LargeResultsSetPagination  # 100개씩 페이지네이션 적용

    def get_queryset(self):
        """필터링 적용: category_id 및 sales_status 기준"""
        queryset = Product.objects.all()
        category_id = self.request.query_params.get('category_id', None)
        sales_status = self.request.query_params.get('sales_status', None)

        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if sales_status:
            queryset = queryset.filter(sales_status=sales_status)

        return queryset.order_by('sales_status', 'price')

# ✅ 2. 특정 상품 조회, 수정, 삭제 (RetrieveUpdateDestroyAPIView)
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# # ✅ 3. 특정 유저가 등록한 제품 조회 (필터링 & 정렬 & 페이지네이션 적용)      
# class UserProductsView(generics.ListAPIView): 
#     serializer_class = ProductSerializer
#     filter_backends = [filters.OrderingFilter]
#     ordering_fields = ['sales_status', 'price']
#     pagination_class = LargeResultsSetPagination  # 100개씩 페이지네이션 적용

#     def get_queryset(self):
#         """특정 유저의 상품 리스트 조회"""
#         user_id = self.kwargs['user_id']
#         queryset = Product.objects.filter(seller_id=user_id)

#         category_id = self.request.query_params.get('category_id', None)
#         sales_status = self.request.query_params.get('sales_status', None)

#         if category_id:
#             queryset = queryset.filter(category_id=category_id)
#         if sales_status:
#             queryset = queryset.filter(sales_status=sales_status)

#         return queryset.order_by('sales_status', 'price')

# ✅ 4. 판매 완료 처리 (PATCH 요청)
class MarkProductAsSoldView(APIView):
    def patch(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)

        if product.sales_status == "sold":
            return Response({"message": "이미 판매 완료된 상품입니다."}, status=status.HTTP_400_BAD_REQUEST)

        product.sales_status = "sold"
        product.purchase_date = timezone.now()
        product.save()

        return Response({"message": "판매 완료 처리됨"}, status=status.HTTP_200_OK)
    
    
class PackageDataView(APIView):
    def post(self, request):
        category_ids = request.data.get("categoryIds", [])
        product_ids = request.data.get("productIds", [])

        # 데이터베이스에서 해당 ID들의 데이터 조회
        categories = Category.objects.filter(id__in=category_ids)
        products = Product.objects.filter(id__in=product_ids)

        # 직렬화 (JSON 변환)
        category_serializer = CategorySerializer(categories, many=True)
        product_serializer = ProductSerializer(products, many=True)

        return Response({
            "categories": category_serializer.data,
            "products": product_serializer.data
        }, status=status.HTTP_200_OK)
