from rest_framework.pagination import PageNumberPagination

class LargeResultsSetPagination(PageNumberPagination):
    page_size = 100  # 기본 100개씩 표시
    page_size_query_param = 'page_size'  # 쿼리 파라미터로 개수 조정 가능
    max_page_size = 1000  # 최대 1000개까지 요청 가능
