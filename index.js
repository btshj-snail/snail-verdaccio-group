const createError = require('http-errors');

class DynamicGroupPlugin {
  constructor(config, stuff) {
    this.config = config;
    const { group = {} } = config || {};
    this.configGroup = group || {};
  }

  allow_action(action) {
    return function(user, pkg, callback) {
      const { name: userName, groups: userGroups } = user;

      // Split pkgName
      const pkgName = pkg.name;
      const isOrgPackage = pkgName.startsWith('@');
      const orgEnd = pkgName.indexOf('/');

      if (isOrgPackage && orgEnd > 0) {
        //设置默认的$group 则表示使用和机构名相同的分组名作为权限分组
        if (pkg[action].includes('$group') && this.configGroup[orgEnd] && this.configGroup[orgEnd].includes(userName)) {
          return callback(null, true);
        }

        for (let i = 0, l = pkg[action].length; i < l; i++) {
          const authGroup = pkg[action][i];
          if (this.configGroup.hasOwnProperty(authGroup)) {
            const userList = this.configGroup[authGroup] || [];
            if (userList.includes(userName)) {
              return callback(null, true);
              break;
            }
          }
        }
      }

      // Direct group access.
      const hasPermission = pkg[action].some(group => userName === group || userGroups.includes(group));
      if (hasPermission) {
        return callback(null, true);
      }

      if (userName) {
        callback(createError(403, `user ${userName} is not allowed to ${action} package ${pkg.name}`));
      } else {
        callback(createError(401, `authorization required to ${action} package ${pkg.name}`));
      }
    };
  }

  allow_access(user, pkg, callback) {
    this.allow_action('access')(user, pkg, callback);
  }
  allow_publish(user, pkg, callback) {
    this.allow_action('publish')(user, pkg, callback);
  }
  allow_unpublish(user, pkg, callback) {
    const action = 'unpublish';
    const isDefined = pkg[action] === null || pkg[action] === undefined;

    const hasSupport = isDefined ? pkg[action] : false;

    if (hasSupport === false) {
      return callback(null, undefined);
    }

    return this.allow_action(action)(user, pkg, callback);
  }
}

module.exports = (cfg, stuff) => new DynamicGroupPlugin(cfg, stuff);
