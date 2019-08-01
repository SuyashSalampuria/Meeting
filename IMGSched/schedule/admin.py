from django.contrib import admin
from schedule.models import meeting
from schedule.models import comment
# Register your models here.
admin.site.register(meeting)
admin.site.register(comment)