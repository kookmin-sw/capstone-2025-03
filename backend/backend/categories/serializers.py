from rest_framework import serializers
from categories.models import Category
from industries.models import Industry

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "industry_ids", "thumbnail"]

    def create(self, validated_data):
        industry_ids = validated_data.pop("industry_ids", [])
        category = Category.objects.create(**validated_data)

        # ✅ ManyToManyField는 set()을 사용해서 추가해야 함
        category.industry_ids.set(industry_ids)  
        return category

    def update(self, instance, validated_data):
        industry_ids = validated_data.pop("industry_ids", None)
        instance.name = validated_data.get("name", instance.name)
        instance.thumbnail = validated_data.get("thumbnail", instance.thumbnail)
        instance.save()

        # ✅ 수정 시 ManyToMany 관계 반영
        if industry_ids is not None:
            instance.industry_ids.set(industry_ids)

        return instance
