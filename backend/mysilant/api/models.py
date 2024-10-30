from django.db import models
from accounts.models import User

class Reference(models.Model):
    EQUIPMENT = "eq"
    ENGINE = "en"
    TRANSMISSION = "tr"
    DRIVE_AXLE = "da"
    STEER_AXLE = "sa"
    MAINTENANCE_TYPE = "mt"
    FAILURE_NODE = "fn"
    REPAIR_METHOD = "rm"

    TYPE_CHOICES = [
        (EQUIPMENT, "Модель техники"),
        (ENGINE, "Модель двигателя"),
        (TRANSMISSION, "Модель трансмиссии"),
        (DRIVE_AXLE, "Модель ведущего моста"),
        (STEER_AXLE, "Модель управляемого моста"),
        (MAINTENANCE_TYPE, "Вид ТО"),
        (FAILURE_NODE, "Узел отказа"),
        (REPAIR_METHOD, "Способ восстановления"),
    ]

    category = models.CharField(max_length=2, choices=TYPE_CHOICES, verbose_name="Категория")
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(null=True, blank=True, verbose_name="Описание")

    class Meta:
        verbose_name = "Справочник"
        verbose_name_plural = "Справочники"

    def __str__(self):
        return f'{self.name}'


class Equipment(models.Model):
    equipment_model = models.ForeignKey(Reference, on_delete=models.RESTRICT, related_name='equipment_model', limit_choices_to={'category': Reference.EQUIPMENT}, verbose_name="Модель техники")
    equipment_serial = models.CharField(max_length=100, unique=True, verbose_name="Зав.№ машины")
    engine_model = models.ForeignKey(Reference, on_delete=models.RESTRICT, related_name='engine_model', limit_choices_to={'category': Reference.ENGINE}, verbose_name="Модель двигателя")
    engine_serial = models.CharField(max_length=100, null=True, blank=True, verbose_name="Зав.№ двигателя")
    transmission_model = models.ForeignKey(Reference, on_delete=models.RESTRICT, related_name='transmission_model', limit_choices_to={'category': Reference.TRANSMISSION}, verbose_name="Модель трансмиссии")
    transmission_serial = models.CharField(max_length=100, null=True, blank=True, verbose_name="Зав.№ трансмиссии")
    drive_axle_model = models.ForeignKey(Reference, on_delete=models.RESTRICT, related_name='drive_axle_model', limit_choices_to={'category': Reference.DRIVE_AXLE}, verbose_name="Модель ведущего моста")
    drive_axle_serial = models.CharField(max_length=100, null=True, blank=True, verbose_name="Зав.№ ведущего моста")
    steer_axle_model = models.ForeignKey(Reference, on_delete=models.RESTRICT, related_name='steer_axle_model', limit_choices_to={'category': Reference.STEER_AXLE}, verbose_name="Модель управляемого моста")
    steer_axle_serial = models.CharField(max_length=100, null=True, blank=True, verbose_name="Зав.№ управляемого моста")
    contract = models.CharField(max_length=100, null=True, blank=True, verbose_name="Договор поставки №, дата")
    shipment_date = models.DateField(verbose_name="Дата отгрузки с завода")
    consignee = models.CharField(max_length=100, verbose_name="Грузополучатель (конечный потребитель)")
    delivery_address = models.CharField(max_length=100, verbose_name="Адрес поставки (эксплуатации)")
    model_options = models.TextField(null=True, blank=True, verbose_name="Комплектация (доп. опции)")
    client = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='equipment_user', limit_choices_to={'role': User.CLIENT}, verbose_name="Клиент")
    service_company = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='equipment_service_company', limit_choices_to={'role': User.SERVICE_COMPANY}, verbose_name="Сервисная компания")

    class Meta:
        verbose_name = "Машина"
        verbose_name_plural = "Машины"

    def __str__(self):
        return f'{self.equipment_serial} ({self.equipment_model})'


class Maintenance(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.RESTRICT, related_name='maintenance_equipment', verbose_name="Зав. № машины")
    maintenance_type = models.ForeignKey(Reference, on_delete=models.RESTRICT, related_name='maintenance_type', limit_choices_to={'category': Reference.MAINTENANCE_TYPE}, verbose_name="Вид ТО")
    maintenance_date = models.DateField(verbose_name="Дата проведения ТО")
    engine_hours = models.IntegerField(verbose_name="Наработка, м/час")
    order_number = models.CharField(max_length=100, null=True, blank=True, verbose_name="№ заказ-наряда")
    order_date = models.DateField(null=True, blank=True, verbose_name="Дата заказ-наряда")
    service_company = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='maintenance_service_company', limit_choices_to={'role': User.SERVICE_COMPANY}, verbose_name="Сервисная компания", null=True, blank=True)


    class Meta:
        verbose_name = "ТО"
        verbose_name_plural = "ТО"

    def __str__(self):
        return f'{self.equipment} | {self.maintenance_type} | Клиент: {self.equipment.client} | СО: {self.service_company if self.service_company else 'самостоятельно'}'
    

class Claim(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.RESTRICT, related_name='claim_equipment', verbose_name="Машина")
    failure_date = models.DateField(verbose_name="Дата отказа")
    engine_hours = models.IntegerField(verbose_name="Наработка, м/час")
    failure_node = models.ForeignKey(Reference, on_delete=models.RESTRICT, related_name='failure_node', limit_choices_to={'category': Reference.FAILURE_NODE}, verbose_name="Узел отказа")
    failure_description = models.TextField(null=True, blank=True, verbose_name="Описание отказа")
    repair_method = models.ForeignKey(Reference, on_delete=models.RESTRICT, related_name='repair_method', limit_choices_to={'category': Reference.REPAIR_METHOD}, verbose_name="Способ восстановления")
    spare_parts = models.TextField(null=True, blank=True, verbose_name="Используемые запасные части")
    repair_date = models.DateField(null=True, blank=True, verbose_name="Дата восстановления")
    downtime = models.IntegerField(editable=False, verbose_name="Время простоя техники")
    service_company = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='claim_service_company', limit_choices_to={'role': User.SERVICE_COMPANY}, verbose_name="Сервисная компания")

    class Meta:
        verbose_name = 'Рекламация'
        verbose_name_plural = 'Рекламации'
    
    def __str__(self):
        return f'{self.equipment} | Узел отказа: {self.failure_node} | Клиент: {self.equipment.client} | СО: {self.service_company if self.service_company else "самостоятельно"}'
    
    def save(self, *args, **kwargs):
        if self.repair_date:
            self.downtime = (self.repair_date - self.failure_date).days
        super(Claim, self).save(*args, **kwargs)
