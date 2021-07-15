# snail-verdaccio-group

Permission plugin for verdaccio. Use groups + users to establish a simple authority system.

## Installation

```shell

    npm install verdaccio-simplegroup -g

```

## How to use

### Default group name

This is a very simple permission setting. Use npm scopename of the package as the group name.

```yarml

auth:
   simplegroup:
      company: Jack Lucy

packages:
   '@company/*':
       access: $all
       publish: $group
       unpublish: $group
```

The above configuration means that the Jacks and Lucy belongs to the `company` group, and the permission for scope of `@company` packages is use.

### Specify group name

You can customize the group name, and grant rights for  `publish`, `unpublish`, `access` using:

```yarml

auth:
   simplegroup:
      group: 
         companyPublish: Jack Lucy
         companyUnpublish: Jack

packages:
   '@company/*':
       access: $all
       publish: companyPublish
       unpublish: companyUnpublish
```

The above configuration means that the group `companyPublish` has publishing rights for scope `@company/*`, and only `companyUnpublish` group has right to unpublish packages in `@company/*` scope.

