from django.urls import path
from rest_framework import routers
from rest_framework.authtoken import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import HaikaiViewSet, TankaViewSet, KotenViewSet, CollectionViewSet, AuthorViewSet, YearViewSet, UserViewSet, NoticeViewSet

router = routers.DefaultRouter()
router.register(r'haikai', HaikaiViewSet)
router.register(r'tanka', TankaViewSet)
router.register(r'koten', KotenViewSet)
router.register(r'collection', CollectionViewSet)
router.register(r'author', AuthorViewSet)
router.register(r'year', YearViewSet)
router.register(r'user', UserViewSet)
router.register(r'notice', NoticeViewSet)

urlpatterns = router.urls

# Authentication
urlpatterns += [
    path('auth/', TokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/verify/', TokenVerifyView.as_view())
]