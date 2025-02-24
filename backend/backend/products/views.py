from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Product
from .serializers import ProductSerializer

# ✅ 1. 전체 상품 조회 및 상품 생성 (ListCreateAPIView)
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# ✅ 2. 특정 상품 조회, 수정, 삭제 (RetrieveUpdateDestroyAPIView)
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# ✅ 3. 특정 유저가 등록한 제품 조회
class UserProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        """특정 유저의 상품 리스트 조회"""
        user_id = self.kwargs['user_id']
        return Product.objects.filter(seller_id=user_id)

# ✅ 4. 판매 완료 처리 (PATCH)
class MarkProductAsSoldView(APIView):
    def patch(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)

        if product.sales_status == "sold":
            return Response({"message": "이미 판매 완료된 상품입니다."}, status=status.HTTP_400_BAD_REQUEST)

        product.sales_status = "sold"
        product.purchase_date = timezone.now()
        product.save()

        return Response({"message": "판매 완료 처리됨"}, status=status.HTTP_200_OK)
