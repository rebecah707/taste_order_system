from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view

from .models import FoodItem, Order, OrderItem, Payment
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    FoodItemSerializer,
    OrderSerializer,
    OrderItemSerializer,
    PaymentSerializer
)


# =================================================
# USER REGISTRATION VIEW
# =================================================
@api_view(['POST'])
def register_user(request):
    """
    Register a new user
    """
    serializer = UserRegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =================================================
# USER LOGIN VIEW
# =================================================
@api_view(['POST'])
def login_user(request):
    """
    Login user using username & password
    """
    serializer = UserLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.validated_data['user']

    return Response({
        "message": "Login successful",
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_superuser
    }, status=status.HTTP_200_OK)


# =================================================
# USER VIEWSET (ADMIN)
# =================================================
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer


# =================================================
# FOOD ITEM VIEWSET
# =================================================
class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer


# =================================================
# ORDER VIEWSET
# =================================================
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        order = self.get_object()

        if order.status != 'suggested':
            return Response(
                {"error": "Order must be suggested first"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = 'approved'
        order.save()
        return Response(OrderSerializer(order).data)

# =================================================
class OrderItemViewSet(viewsets.ModelViewSet):
    """
    Create, Read, Update, Delete Order Items
    """
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"message": "Order item deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )


# =================================================
# PAYMENT VIEWSET
# =================================================
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment = serializer.save(status='completed')

        order = payment.order
        order.status = 'paid'
        order.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
