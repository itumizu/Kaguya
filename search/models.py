from django.db import models


class Collection(models.Model):
    name = models.CharField(verbose_name='作品名', max_length=100, blank=False, null=False)
    parent = models.ForeignKey("self", verbose_name='親作品名', blank=True, null=True, on_delete=models.PROTECT)

    def __str__(self):
        if self.parent:
            return self.parent.name + " : " + self.name
        else:
            return self.name

    class Meta:
        verbose_name = '作品'
        verbose_name_plural = '作品'

class Haikai(models.Model):

    firstPart = models.CharField(verbose_name='上の句', max_length=50,
                            blank=False, null=False)

    secondPart = models.CharField(verbose_name='中の句', max_length=50,
                            blank=False, null=False)

    lastPart = models.CharField(verbose_name='下の句', max_length=50,
                            blank=False, null=False)

    firstPartKana = models.CharField(verbose_name='上の句(かな)', max_length=100,
                            blank=True, null=True)

    secondPartKana = models.CharField(verbose_name='中の句(かな)', max_length=100,
                            blank=True, null=True)

    lastPartKana = models.CharField(verbose_name='下の句(かな)', max_length=100,
                            blank=True, null=True)

    collection = models.ForeignKey(Collection, verbose_name='所蔵作品', on_delete=models.PROTECT)
                   
    def __str__(self):
        return self.firstPart + " " + self.secondPart + " " + self.lastPart

    class Meta:
        verbose_name = '俳諧'
        verbose_name_plural = '俳諧'

class Tanka(models.Model):

    firstPart = models.CharField(verbose_name='初句', max_length=50,
                            blank=False, null=False)

    secondPart = models.CharField(verbose_name='二句', max_length=50,
                            blank=False, null=False)

    thirdPart = models.CharField(verbose_name='三句', max_length=50,
                            blank=False, null=False)

    fourthPart = models.CharField(verbose_name='四句', max_length=50,
                            blank=False, null=False)
                            
    lastPart = models.CharField(verbose_name='結句', max_length=50,
                            blank=False, null=False)

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

    collection = models.ForeignKey(Collection, verbose_name='所蔵作品', on_delete=models.PROTECT)

    def __str__(self):
        return self.firstPart + " " + self.secondPart + " " + self.thirdPart + " " + self.fourthPart + " " + self.lastPart

    class Meta:
        verbose_name = '短歌'
        verbose_name_plural = '短歌'