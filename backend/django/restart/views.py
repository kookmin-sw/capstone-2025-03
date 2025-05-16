from django.views import View
from django.http import JsonResponse
from django.core.cache import cache

class CacheHealthCheck(View):
    def get(self, request, *args, **kwargs):
        try:
            # 테스트 키로 set → get
            cache.set('healthcheck_ping', 'pong', timeout=30)
            pong = cache.get('healthcheck_ping')
            ok = (pong == 'pong')
            return JsonResponse({'redis_ok': ok})
        except Exception as e:
            # 예외가 발생하면 상태코드 500과 에러 메시지 반환
            return JsonResponse({'redis_error': str(e)}, status=500)