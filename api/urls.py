from django.urls import path, include
from .v1 import urls as v1Urls
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('v1/', include(csrf_exempt(v1Urls))),
]