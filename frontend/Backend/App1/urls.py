from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    register_user,
    login_user,
    UserViewSet,
    FoodItemViewSet,
    OrderViewSet,
    OrderItemViewSet,
    PaymentViewSet
)

# =================================================
# DRF ROUTER
# =================================================
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'food-items', FoodItemViewSet, basename='food-items')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'order-items', OrderItemViewSet, basename='order-items')
router.register(r'payments', PaymentViewSet, basename='payments')

# =================================================
# URL PATTERNS
# =================================================
urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('', include(router.urls)),
]
