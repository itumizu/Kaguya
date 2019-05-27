from django.conf import settings
from ipaddress import ip_network, ip_address

from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.views import redirect_to_login
from django.contrib.auth.decorators import login_required, resolve_url

def ip_login_required(function):
    def _wrapped_view(request, *args, **kwargs):
        ip = ip_address(request.META.get('HTTP_X_FORWARDED_FOR').split(',')[0])
        allowedipList = [ip_network(ipAddress) for ipAddress in settings.ALLOWED_IP_BLOCKS]
        
        ipCheck = False

        for allowedipBlock in allowedipList:
            if ip in allowedipBlock:
                ipCheck = True
                break

        if not ipCheck:
            if request.user.is_authenticated:
                return function(request, *args, **kwargs)
            else:
                return redirect_to_login(request.get_full_path(), resolve_url(settings.LOGIN_URL), REDIRECT_FIELD_NAME)
        else:
            return function(request, *args, **kwargs)

    return _wrapped_view