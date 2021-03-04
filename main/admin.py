from django.contrib import admin
from .models import Details
from .models import Person
from .models import Purchase
from .models import *

# Register your models here.
admin.site.register(Details)
admin.site.register(Person)
admin.site.register(Purchase)
admin.site.register(Debt)