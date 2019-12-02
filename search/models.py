import uuid

from django.db import models
from django.core.validators import MinValueValidator, RegexValidator
from markdownx.models import MarkdownxField
from users.models import User

class Collection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(verbose_name='作品名', max_length=100, blank=False, null=False)
    parent = models.ForeignKey("self", verbose_name='親作品名', blank=True, null=True, on_delete=models.PROTECT, related_name='childCollection')
    description =  MarkdownxField('説明', help_text='Markdown形式で記述できます。', default="", blank=True, null=True)
    
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True) 
    
    created_by = models.ForeignKey(User, verbose_name='作成者', null= True, blank= True, on_delete=models.PROTECT, related_name = "created_collection_user")
    updated_by = models.ForeignKey(User, verbose_name='更新者', null= True, blank= True, on_delete=models.PROTECT, related_name = "updated_collection_user")

    def __str__(self):
        if self.parent:
            return self.parent.name + " : " + self.name
        else:
            return self.name

    class Meta:
        verbose_name = '作品'
        verbose_name_plural = '作品'
        unique_together = ('name', 'parent')

class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(verbose_name='作者名', max_length=100, unique=True, blank=False, null=False)
    description =  MarkdownxField('説明', help_text='Markdown形式で記述できます。', default="", blank=True, null=True)
    
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)

    created_by = models.ForeignKey(User, verbose_name='作成者', null= True, blank= True, on_delete=models.PROTECT, related_name = "created_author_user")
    updated_by = models.ForeignKey(User, verbose_name='更新者', null= True, blank= True, on_delete=models.PROTECT, related_name = "updated_author_user")
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = '作者'
        verbose_name_plural = '作者'
    
class Year(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    jpnYear = models.CharField(verbose_name='和暦', max_length=100, unique=True, blank=False, null=False)

    adYear = models.IntegerField(verbose_name='西暦', validators=[MinValueValidator(1)], unique=True, blank=True, null=True)
    
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)
    
    created_by = models.ForeignKey(User, verbose_name='作成者', null= True, blank= True, on_delete=models.PROTECT, related_name = "created_year_user")
    updated_by = models.ForeignKey(User, verbose_name='更新者', null= True, blank= True, on_delete=models.PROTECT, related_name = "updated_year_user")
    def __str__(self):
        if self.adYear:
            return self.jpnYear + " (" + self.adYear + ")"

        else:
            return self.jpnYear
        
    class Meta:
        verbose_name = '和暦'
        verbose_name_plural = '和暦'
        unique_together = ('jpnYear', 'adYear', )

class Haikai(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    number =  models.IntegerField(verbose_name='番号', validators=[MinValueValidator(1)], 
                            blank=False, null=False)

    firstPart = models.CharField(verbose_name='上の句', max_length=50,
                            blank=True, null=True)

    secondPart = models.CharField(verbose_name='中の句', max_length=50,
                            blank=True, null=True)

    lastPart = models.CharField(verbose_name='下の句', max_length=50,
                            blank=True, null=True)

    firstPartKana = models.CharField(verbose_name='上の句(かな)', max_length=100,
                            blank=True, null=True)

    secondPartKana = models.CharField(verbose_name='中の句(かな)', max_length=100,
                            blank=True, null=True)

    lastPartKana = models.CharField(verbose_name='下の句(かな)', max_length=100,
                            blank=True, null=True)

    description =  MarkdownxField('説明', help_text='Markdown形式で記述できます。', default="", blank=True, null=True)
    author = models.ForeignKey(Author, verbose_name='作者名', blank=True, null=True, on_delete=models.PROTECT)
    collection = models.ForeignKey(Collection, verbose_name='所蔵作品', on_delete=models.PROTECT)
    year = models.ForeignKey(Year, verbose_name='発表年', blank=True, null=True, on_delete=models.PROTECT)
    
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)

    created_by = models.ForeignKey(User, verbose_name='作成者', null= True, blank= True, on_delete=models.PROTECT, related_name = "created_haikai_user")
    updated_by = models.ForeignKey(User, verbose_name='更新者', null= True, blank= True, on_delete=models.PROTECT, related_name = "updated_haikai_user")
    
    def __str__(self):
        if not self.firstPart:
            return str(self.firstPartKana) + " " + str(self.secondPartKana) + " " + str(self.lastPartKana)
        else:
            return str(self.firstPart) + " " + str(self.secondPart) + " " + str(self.lastPart)

    class Meta:
        verbose_name = '俳諧'
        verbose_name_plural = '俳諧'

        unique_together = (
            ('firstPart', 'secondPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'lastPartKana', 'collection', 'author'),
        )

class Tanka(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    number =  models.IntegerField(verbose_name='番号', validators=[MinValueValidator(1)], 
                            blank=False, null=False)

    firstPart = models.CharField(verbose_name='初句', max_length=50,
                            blank=True, null=True)

    secondPart = models.CharField(verbose_name='二句', max_length=50,
                            blank=True, null=True)

    thirdPart = models.CharField(verbose_name='三句', max_length=50,
                            blank=True, null=True)

    fourthPart = models.CharField(verbose_name='四句', max_length=50,
                            blank=True, null=True)
                            
    lastPart = models.CharField(verbose_name='結句', max_length=50,
                            blank=True, null=True)

    firstPartKana = models.CharField(verbose_name='初句(かな)', max_length=100,
                            blank=True, null=True)

    secondPartKana = models.CharField(verbose_name='二句(かな)', max_length=100,
                            blank=True, null=True)

    thirdPartKana = models.CharField(verbose_name='三句(かな)', max_length=100,
                            blank=True, null=True)

    fourthPartKana = models.CharField(verbose_name='四句(かな)', max_length=100,
                            blank=True, null=True)
                            
    lastPartKana = models.CharField(verbose_name='結句(かな)', max_length=100,
                            blank=True, null=True)

    description =  MarkdownxField('説明', help_text='Markdown形式で記述できます。', default="", blank=True, null=True)
    author = models.ForeignKey(Author, verbose_name='作者名', blank=True, null=True, on_delete=models.PROTECT)
    collection = models.ForeignKey(Collection, verbose_name='所蔵作品', on_delete=models.PROTECT)    
    year = models.ForeignKey(Year, verbose_name='発表年', blank=True, null=True, on_delete=models.PROTECT)
    
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)

    created_by = models.ForeignKey(User, verbose_name='作成者', null= True, blank= True, on_delete=models.PROTECT, related_name = "created_tanka_user")
    updated_by = models.ForeignKey(User, verbose_name='更新者', null= True, blank= True, on_delete=models.PROTECT, related_name = "updated_tanka_user")

    def __str__(self):
        if not self.firstPart:
            return str(self.firstPartKana) + " " + str(self.secondPartKana) + " " + str(self.thirdPartKana) + " " + str(self.fourthPartKana) + " " + str(self.lastPartKana)
        else:
            return str(self.firstPart) + " " + str(self.secondPart) + " " + str(self.thirdPart) + " " + str(self.fourthPart) + " " + str(self.lastPart)
        

    class Meta:
        verbose_name = '短歌'
        verbose_name_plural = '短歌'

        unique_together = (
            ('firstPart', 'secondPart', 'thirdPart', 'fourthPart', 'lastPart', 'firstPartKana', 'secondPartKana', 'thirdPartKana', 'fourthPartKana', 'lastPartKana', 'collection', 'author'),
        )
    
class Koten(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    text =  MarkdownxField('本文', help_text='Markdown形式で記述できます。', default="", blank=False, null=False)
    description =  MarkdownxField('説明', help_text='Markdown形式で記述できます。', default="", blank=True, null=True)

    author = models.ForeignKey(Author, verbose_name='作者名', blank=True, null=True, on_delete=models.PROTECT)
    collection = models.ForeignKey(Collection, verbose_name='所蔵作品', on_delete=models.PROTECT)
    year = models.ForeignKey(Year, verbose_name='発表年', blank=True, null=True, on_delete=models.PROTECT)
    
    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)

    created_by = models.ForeignKey(User, verbose_name='作成者', null= True, blank= True, on_delete=models.PROTECT, related_name = "created_koten_user")
    updated_by = models.ForeignKey(User, verbose_name='更新者', null= True, blank= True, on_delete=models.PROTECT, related_name = "updated_koten_user")

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = '古典'
        verbose_name_plural = '古典'

        unique_together = (
            ('text', 'collection', 'author'),
        )

class Notice(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    title = models.CharField(
        verbose_name='タイトル',
        blank=False,
        null=False,
        max_length=100,
        default='',
        validators=[RegexValidator(
            regex=u'^[ぁ-んァ-ヶー一-龠]+$',
            message='全角のひらがな・カタカナ・漢字で入力してください',
        )]
    )

    body = models.TextField(
        verbose_name='本文',
        blank=True,
        null=True,
        max_length=3000
    )

    created_at = models.DateTimeField(verbose_name='作成日時', auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name='更新日時', auto_now=True)

    def __str__(self):
        return self.title + f"({str(self.created_at)})"
    
    class Meta:
        verbose_name = 'お知らせ'
        verbose_name_plural = 'お知らせ'