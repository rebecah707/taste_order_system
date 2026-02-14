from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import FoodItem, Order, OrderItem, Payment


# =================================================
# USER REGISTRATION SERIALIZER
# =================================================
class UserRegisterSerializer(serializers.ModelSerializer):
    # Extra field for confirm password
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'confirm_password'
        )
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Validate password & confirm password
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match"}
            )
        return data

    # Override create to hash password
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user


# =================================================
# USER LOGIN SERIALIZER
# =================================================
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    # Authenticate user
    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid username or password"
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "User account is disabled"
            )

        data['user'] = user
        return data


# =================================================
# FOOD ITEM SERIALIZER
# =================================================
class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = '__all__'


# =================================================
# ORDER ITEM SERIALIZER
# =================================================
class OrderItemSerializer(serializers.ModelSerializer):
    food_item_name = serializers.ReadOnlyField(source='food_item.name')

    class Meta:
        model = OrderItem
        fields = '__all__'

    


# =================================================
# ORDER SERIALIZER
# =================================================
class OrderSerializer(serializers.ModelSerializer):
    customer_username = serializers.ReadOnlyField(source='customer.username')
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'customer',
            'customer_username',
            'event_type',
            'event_date',
            'number_of_people',
            'budget',
            'suggested_price',
            'status',
            'items',
            'created_at'
        )
        read_only_fields = (
            'customer',
            'suggested_price',
            'status',
            'created_at'
        )


# =================================================
# PAYMENT SERIALIZER
# =================================================
class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.ReadOnlyField(source='order.id')

    class Meta:
        model = Payment
        fields = (
            'id',
            'order',
            'order_id',
            'amount',
            'payment_method',
            'status',
            
        )
        read_only_fields = (
            'status',
            
        )
