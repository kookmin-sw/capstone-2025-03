from rest_framework.pagination import PageNumberPagination

class LargeResultsSetPagination(PageNumberPagination):
    page_size = 100  # 한 페이지에 100개씩 표시
    page_size_query_param = 'page_size'
    max_page_size = 1000  # 최대 1000개까지 허용
