from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os

class Command(BaseCommand):
    help = "Creates a default admin user if it doesn't exist"

    def handle(self, *args, **kwargs):
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin1234")

        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(
                username=admin_username, email=admin_email, password=admin_password
            )
            self.stdout.write(self.style.SUCCESS(f"Admin user '{admin_username}' created successfully!"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Admin user '{admin_username}' already exists."))
