from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    CLIENT = "cl"
    SERVICE_COMPANY = "sc"
    MANAGER = "mn"
    ROLE_CHOICES = [
        (CLIENT, "Клиент"),
        (SERVICE_COMPANY, "Сервисная компания"),
        (MANAGER, "Менеджер"),
    ]

    role = models.CharField(max_length=2, choices=ROLE_CHOICES, default=CLIENT, verbose_name="Роль")
    company_name = models.CharField(max_length=100, null=True, blank=True, verbose_name="Название компании")

    def __str__(self):
        if self.role in {self.CLIENT, self.SERVICE_COMPANY} and self.company_name:
            return self.company_name
        return f"{self.first_name} {self.last_name}".strip() or "Неизвестный пользователь"