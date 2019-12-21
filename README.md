# snail-verdaccio-group

verdaccio 的权限插件。利用分组+用户建立简单的权限体系。

## 使用方式

### 默认分组名

这是一种极简单的一种权限设置。利用`npm`包的`scope`名称，作为分组名称。

```yarml

auth:
   verdacciogroup:
      company: Jack Lucy

packages:
   '@company/*':
       access: $all
       publish: $group
       unpublish: $group
```

以上的配置，则表示`Jack`和`Lucy`属于`company`分组，而`scope`为`company`的包的`publish`和`unpublish`权限是使用`$group`.因此`company`分组拥有`publish`和`unpublish`权限。

### 指定分组名

可以自定义分组名，并且在`publish`、`unpublish`、`access`中使用

```yarml

auth:
   verdacciogroup:
      companyPublish: Jack Lucy
      companyUnpublish: Jack

packages:
   '@company/*':
       access: $all
       publish: companyPublish
       unpublish: companyUnpublish
```

以上配置，则表示分组 `companyPublish` 拥有`@company/*`包的发布权限，分组 `companyUnpublish` 拥有`@company/*`包的撤销发布权限。
