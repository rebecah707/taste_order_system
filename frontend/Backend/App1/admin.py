from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import FoodItem, Order, OrderItem, Payment

admin.site.register(FoodItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)

