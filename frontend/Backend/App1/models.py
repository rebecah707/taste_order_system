from django.db import models
from django.contrib.auth.models import User
import uuid


# =========================
# FOOD ITEM MODEL
# =========================
class FoodItem(models.Model):
    name = models.CharField(max_length=100)
    price_per_person = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


# =========================
# ORDER MODEL
# =========================
class Order(models.Model):

    EVENT_TYPES = (
        ('meeting', 'Meeting'),
        ('ceremony', 'Ceremony'),
        ('birthday', 'Birthday'),
        ('other', 'Other'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('suggested', 'Suggested'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
    )

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders'
    )

    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    event_date = models.DateField()
    number_of_people = models.PositiveIntegerField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id}"

    # -------------------------
    # CALCULATED FIELD
    # -------------------------
    @property
    def suggested_price(self):
        """
        Calculate suggested price based on order items
        """
        total = 0
        for item in self.items.all():
            total += item.total_price
        return total

    @property
    def is_within_budget(self):
        """
        Check if suggested price is within budget
        """
        return self.suggested_price <= self.budget


# =========================
# ORDER ITEM MODEL
# =========================
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name='items',
        on_delete=models.CASCADE
    )

    food_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    price_per_person = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.food_name} x {self.quantity}"

    @property
    def total_price(self):

        """
        Calculate total price for this item
        """
        return self.quantity * self.price_per_person


# =========================
# PAYMENT MODEL
# =========================
class Payment(models.Model):

    PAYMENT_METHODS = (
        ('mobile', 'Mobile Money'),
        ('bank', 'Bank'),
        ('control', 'Control Number'),
    )

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='payment'
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)

    phone_or_account = models.CharField(max_length=50, blank=True)
    control_number = models.CharField(max_length=20, blank=True)

    status = models.CharField(
        max_length=20,
        default='pending'
    )

    def save(self, *args, **kwargs):
        # Auto-generate control number
        if self.payment_method == 'control' and not self.control_number:
            self.control_number = str(uuid.uuid4()).split('-')[0]

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment for Order #{self.order.id}"
