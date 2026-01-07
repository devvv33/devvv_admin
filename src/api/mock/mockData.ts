/**
 * Mock 默认数据
 * 首次访问时会使用这些数据初始化本地存储
 */

// 默认用户数据
export const defaultAdminList = [
  {
    adminId: "1",
    avatar: "/cmsFile/2512/31/114239_742f096da61d4d0587497512971aa736.jpeg",
    department: {
      deptCode: "DEV",
      deptName: "开发部",
      id: "1",
      idPath: "/1/",
      parentId: "0",
      sort: 1,
      status: "Enable",
    },
    departmentId: "1",
    loginCount: "1",
    mobile: "15122222222",
    nickname: "超管",
    roleList: [
      {
        id: "1",
        roleCode: "SUPER_ADMIN",
        roleName: "超管",
        status: "Enable",
      }
    ],
    status: "Enable",
    username: "superadmin",
    password: "123456" // 用于登录验证
  }
]

// 默认角色数据
export const defaultRoleList = [
  {
    id: "1",
    remark: "",
    roleCode: "SUPER_ADMIN",
    roleName: "超管",
    sort: 1,
    status: "Enable",
    createTime: "2026-01-01 00:00:00"
  },
  {
    id: "2",
    remark: "新用户的临时角色",
    roleCode: "GUEST",
    roleName: "游客",
    sort: 2,
    status: "Enable",
    createTime: "2026-01-01 00:00:00"
  },
]

// 默认部门数据
export const defaultDeptList = [
  {
    id: "1",
    deptCode: "DEV",
    deptName: "开发部",
    idPath: "/1/",
    parentId: "0",
    sort: 1,
    status: "Enable",
    leader: "",
    mobile: "",
    remark: ""
  },
  {
    id: "2",
    deptCode: "PRODUCT",
    deptName: "产品部",
    idPath: "/2/",
    parentId: "0",
    sort: 2,
    status: "Enable",
    leader: "",
    mobile: "",
    remark: ""
  },
  {
    id: "3",
    deptCode: "TEST",
    deptName: "测试部",
    idPath: "/3/",
    parentId: "0",
    sort: 3,
    status: "Enable",
    leader: "",
    mobile: "",
    remark: ""
  },
  {
    id: "4",
    deptCode: "GUEST",
    deptName: "游客",
    idPath: "/4/",
    parentId: "0",
    remark: "新用户所在临时部门",
    sort: 999,
    status: "Enable",
    leader: "",
    mobile: ""
  }
]

// 默认菜单数据 (扁平结构，同时用于 userMenus 和 allMenuTree)
export const defaultMenuList = [
  {
    apiUrl: "/cmsApi/role/addRole",
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [],
    formFieldList: [
      {
        extra: "",
        fieldKey: "roleCode",
        fieldLabel: "角色Code",
        fieldType: "Form",
        id: "333",
        inputType: "input",
        menuId: "7",
        required: true
      },
      {
        extra: "",
        fieldKey: "roleName",
        fieldLabel: "角色名称",
        fieldType: "Form",
        id: "334",
        inputType: "input",
        menuId: "7",
        required: true
      },
      {
        extra: "{\"defaultValue\":10}",
        fieldKey: "sort",
        fieldLabel: "序号",
        fieldType: "Form",
        id: "335",
        inputType: "number",
        menuId: "7",
        required: true
      },
      {
        extra: "{\"defaultValue\":\"Enable\",\"enumOptions\":\"com.kabda.commons.common.enums.status.EnableStatus\"}",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Form",
        id: "336",
        inputType: "select",
        menuId: "7",
        required: true
      },
      {
        extra: "",
        fieldKey: "remark",
        fieldLabel: "备注",
        fieldType: "Form",
        id: "337",
        inputType: "input",
        menuId: "7",
        required: false
      }
    ],
    icon: "Plus",
    id: "7",
    idPath: "/3/4/6/7/",
    menuName: "添加角色",
    menuType: "BUTTON",
    parentId: "6",
    searchFieldList: [],
    sort: 0
  },
  {
    columnFieldList: [],
    formFieldList: [],
    icon: "HomeFilled",
    id: "1",
    idPath: "/1/",
    menuName: "首页",
    menuType: "MODULE",
    parentId: "0",
    searchFieldList: [],
    sort: 1
  },
  {
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [],
    formFieldList: [],
    icon: "Folder",
    id: "4",
    idPath: "/3/4/",
    menuName: "菜单权限",
    menuType: "DIRECTORY",
    parentId: "3",
    searchFieldList: [],
    sort: 1
  },
  {
    columnFieldList: [],
    customComponent: "menu_manage",
    formFieldList: [],
    icon: "Menu",
    id: "5",
    idPath: "/3/4/5/",
    menuName: "菜单管理",
    menuType: "PAGE",
    pageType: "CUSTOM",
    parentId: "4",
    routePath: "/sys/menu",
    searchFieldList: [],
    sort: 1
  },
  {
    apiUrl: "/cmsApi/dept/addDept",
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [],
    formFieldList: [
      {
        extra: "{\"defaultValue\":0}",
        fieldKey: "parentId",
        fieldLabel: "上级部门ID",
        fieldType: "Form",
        id: "350",
        inputType: "input",
        menuId: "13",
        required: true
      },
      {
        extra: "",
        fieldKey: "deptCode",
        fieldLabel: "部门Code",
        fieldType: "Form",
        id: "351",
        inputType: "input",
        menuId: "13",
        required: true
      },
      {
        extra: "",
        fieldKey: "deptName",
        fieldLabel: "部门名称",
        fieldType: "Form",
        id: "352",
        inputType: "input",
        menuId: "13",
        required: true
      },
      {
        extra: "{\"defaultValue\":10}",
        fieldKey: "sort",
        fieldLabel: "排序",
        fieldType: "Form",
        id: "353",
        inputType: "number",
        menuId: "13",
        required: true
      },
      {
        extra: "",
        fieldKey: "leader",
        fieldLabel: "负责人",
        fieldType: "Form",
        id: "354",
        inputType: "input",
        menuId: "13",
        required: false
      },
      {
        extra: "",
        fieldKey: "mobile",
        fieldLabel: "联系电话",
        fieldType: "Form",
        id: "355",
        inputType: "input",
        menuId: "13",
        required: false
      },
      {
        extra: "{\"defaultValue\":\"Enable\",\"enumOptions\":\"com.kabda.commons.common.enums.status.EnableStatus\"}",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Form",
        id: "356",
        inputType: "select",
        menuId: "13",
        required: true
      },
      {
        extra: "",
        fieldKey: "remark",
        fieldLabel: "备注",
        fieldType: "Form",
        id: "357",
        inputType: "input",
        menuId: "13",
        required: false
      }
    ],
    icon: "Plus",
    id: "13",
    idPath: "/3/4/12/13/",
    menuName: "添加部门",
    menuType: "BUTTON",
    parentId: "12",
    searchFieldList: [],
    sort: 1
  },
  {
    apiUrl: "/cmsApi/admin/createAdmin",
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [],
    formFieldList: [
      {
        extra: "",
        fieldKey: "username",
        fieldLabel: "用户名",
        fieldType: "Form",
        id: "175",
        inputType: "input",
        menuId: "34",
        required: true
      },
      {
        extra: "",
        fieldKey: "password",
        fieldLabel: "密码",
        fieldType: "Form",
        id: "176",
        inputType: "input",
        menuId: "34",
        required: true
      },
      {
        extra: "",
        fieldKey: "nickname",
        fieldLabel: "昵称",
        fieldType: "Form",
        id: "177",
        inputType: "input",
        menuId: "34",
        required: true
      },
      {
        extra: "",
        fieldKey: "mobile",
        fieldLabel: "手机号",
        fieldType: "Form",
        id: "178",
        inputType: "input",
        menuId: "34",
        required: false
      },
      {
        extra: "{\"defaultValue\":\"Enable\",\"enumOptions\":\"com.kabda.commons.common.enums.status.EnableStatus\"}",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Form",
        id: "179",
        inputType: "select",
        menuId: "34",
        required: true
      },
      {
        extra: "{\"queryUrl\":\"/cmsApi/dept/treeListDept\",\"checkStrictly\":true,\"showCheckbox\":false,\"props\":{\"value\":\"id\",\"label\":\"deptName\",\"children\":\"children\"},\"defaultValue\":\"4\"}",
        fieldKey: "departmentId",
        fieldLabel: "所属部门",
        fieldType: "Form",
        id: "180",
        inputType: "treeSelect",
        menuId: "34",
        required: true
      },
      {
        extra: "{\"queryUrl\":\"/cmsApi/role/listRole\",\"multiple\":true,\"props\":{\"value\":\"id\",\"label\":\"roleName\"},\"defaultValue\":[\"2\"]}",
        fieldKey: "roleIdList",
        fieldLabel: "角色",
        fieldType: "Form",
        id: "181",
        inputType: "select",
        menuId: "34",
        required: true
      }
    ],
    icon: "Plus",
    id: "34",
    idPath: "/3/4/20/34/",
    menuName: "添加用户",
    menuType: "BUTTON",
    parentId: "20",
    searchFieldList: [],
    sort: 1
  },
  {
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [],
    customComponent: "HomeDashboard",
    formFieldList: [],
    icon: "DataBoard",
    id: "2",
    idPath: "/1/2/",
    menuName: "工作台",
    menuType: "PAGE",
    pageType: "CUSTOM",
    parentId: "1",
    routePath: "/home",
    searchFieldList: [],
    sort: 2
  },
  {
    apiUrl: "/cmsApi/admin/updateAdmin",
    beforeShowScript: "row.roleIdList = row.roleList?.map(role => role.id);\r\nreturn row;",
    buttonAction: "MODAL_FORM",
    buttonPosition: "ROW",
    columnFieldList: [],
    formFieldList: [
      {
        extra: "{\"disabled\":true}",
        fieldKey: "adminId",
        fieldLabel: "用户ID",
        fieldType: "Form",
        id: "182",
        inputType: "input",
        menuId: "35",
        required: true
      },
      {
        extra: "",
        fieldKey: "nickname",
        fieldLabel: "昵称",
        fieldType: "Form",
        id: "183",
        inputType: "input",
        menuId: "35",
        required: true
      },
      {
        extra: "{\"accept\":\"image/*\"}",
        fieldKey: "avatarFile",
        fieldLabel: "头像",
        fieldType: "Form",
        id: "184",
        inputType: "upload",
        menuId: "35",
        required: false
      },
      {
        extra: "",
        fieldKey: "mobile",
        fieldLabel: "手机号",
        fieldType: "Form",
        id: "185",
        inputType: "input",
        menuId: "35",
        required: false
      },
      {
        extra: "{\"defaultValue\":\"Enable\",\"enumOptions\":\"com.kabda.commons.common.enums.status.EnableStatus\"}",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Form",
        id: "186",
        inputType: "select",
        menuId: "35",
        required: true
      },
      {
        extra: "{\"queryUrl\":\"/cmsApi/dept/treeListDept\",\"checkStrictly\":true,\"showCheckbox\":false,\"props\":{\"value\":\"id\",\"label\":\"deptName\",\"children\":\"children\"},\"defaultValue\":\"4\"}",
        fieldKey: "departmentId",
        fieldLabel: "所属部门",
        fieldType: "Form",
        id: "187",
        inputType: "treeSelect",
        menuId: "35",
        required: true
      },
      {
        extra: "{\"queryUrl\":\"/cmsApi/role/listRole\",\"multiple\":true,\"props\":{\"value\":\"id\",\"label\":\"roleName\"},\"defaultValue\":[\"2\"]}",
        fieldKey: "roleIdList",
        fieldLabel: "角色",
        fieldType: "Form",
        id: "188",
        inputType: "select",
        menuId: "35",
        required: true
      }
    ],
    icon: "Edit",
    id: "35",
    idPath: "/3/4/20/35/",
    menuName: "修改用户",
    menuType: "BUTTON",
    parentId: "20",
    searchFieldList: [],
    sort: 2
  },
  {
    columnFieldList: [],
    formFieldList: [],
    icon: "Setting",
    id: "3",
    idPath: "/3/",
    menuName: "系统管理",
    menuType: "MODULE",
    parentId: "0",
    searchFieldList: [],
    sort: 3
  },
  {
    apiUrl: "/cmsApi/admin/pageListAdmin",
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [
      {
        extra: "",
        fieldKey: "adminId",
        fieldLabel: "用户ID",
        fieldType: "Column",
        formatScript: "",
        id: "312",
        menuId: "20",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "username",
        fieldLabel: "用户名",
        fieldType: "Column",
        formatScript: "",
        id: "313",
        menuId: "20",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "nickname",
        fieldLabel: "昵称",
        fieldType: "Column",
        formatScript: "",
        id: "314",
        menuId: "20",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "avatar",
        fieldLabel: "头像",
        fieldType: "Column",
        formatScript: "",
        id: "315",
        menuId: "20",
        showType: "IMAGE",
        width: ""
      },
      {
        extra: "",
        fieldKey: "mobile",
        fieldLabel: "手机号",
        fieldType: "Column",
        formatScript: "",
        id: "316",
        menuId: "20",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "deptId",
        fieldLabel: "所属部门",
        fieldType: "Column",
        formatScript: "return row.department?.deptName || row.deptId",
        id: "317",
        menuId: "20",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "roles",
        fieldLabel: "角色",
        fieldType: "Column",
        formatScript: "return row.roleList?.map(item => item.roleName).join(',')",
        id: "318",
        menuId: "20",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Column",
        formatScript: "return value==='Enable'?'正常':value==='Disable'?'禁用':value",
        id: "319",
        menuId: "20",
        showType: "TAG",
        width: ""
      },
      {
        extra: "",
        fieldKey: "lastLoginTime",
        fieldLabel: "最后登录时间",
        fieldType: "Column",
        formatScript: "",
        id: "320",
        menuId: "20",
        showType: "TEXT",
        width: ""
      }
    ],
    formFieldList: [],
    icon: "UserFilled",
    id: "20",
    idPath: "/3/4/20/",
    menuName: "用户列表",
    menuType: "PAGE",
    pageType: "LIST",
    parentId: "4",
    routePath: "/sys/admin",
    searchFieldList: [
      {
        extra: "",
        fieldKey: "adminId",
        fieldLabel: "用户ID",
        fieldType: "Search",
        id: "309",
        inputType: "input",
        menuId: "20",
        required: false
      },
      {
        extra: "",
        fieldKey: "nickname",
        fieldLabel: "昵称",
        fieldType: "Search",
        id: "310",
        inputType: "input",
        menuId: "20",
        required: false
      },
      {
        extra: "{\"queryUrl\":\"/cmsApi/role/listRole\",\"props\":{\"value\":\"id\",\"label\":\"roleName\"}}",
        fieldKey: "roleId",
        fieldLabel: "角色",
        fieldType: "Search",
        id: "311",
        inputType: "select",
        menuId: "20",
        required: false
      }
    ],
    sort: 9
  },
  {
    apiUrl: "/cmsApi/role/pageListRole",
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [
      {
        extra: "",
        fieldKey: "id",
        fieldLabel: "角色ID",
        fieldType: "Column",
        formatScript: "",
        id: "303",
        menuId: "6",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "roleCode",
        fieldLabel: "角色Code",
        fieldType: "Column",
        formatScript: "",
        id: "304",
        menuId: "6",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "roleName",
        fieldLabel: "角色名称",
        fieldType: "Column",
        formatScript: "",
        id: "305",
        menuId: "6",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Column",
        formatScript: "return value==='Enable'?'正常':value==='Disable'?'禁用':value",
        id: "306",
        menuId: "6",
        showType: "TAG",
        width: ""
      },
      {
        extra: "",
        fieldKey: "remark",
        fieldLabel: "备注",
        fieldType: "Column",
        formatScript: "",
        id: "307",
        menuId: "6",
        showType: "TEXT",
        width: ""
      },
      {
        extra: "",
        fieldKey: "createTime",
        fieldLabel: "创建时间",
        fieldType: "Column",
        formatScript: "",
        id: "308",
        menuId: "6",
        showType: "TEXT",
        width: ""
      }
    ],
    formFieldList: [],
    icon: "User",
    id: "6",
    idPath: "/3/4/6/",
    menuName: "角色列表",
    menuType: "PAGE",
    pageType: "LIST",
    parentId: "4",
    routePath: "/sys/role",
    searchFieldList: [
      {
        extra: "",
        fieldKey: "roleCode",
        fieldLabel: "角色Code",
        fieldType: "Search",
        id: "300",
        inputType: "input",
        menuId: "6",
        required: false
      },
      {
        extra: "",
        fieldKey: "roleName",
        fieldLabel: "角色名称",
        fieldType: "Search",
        id: "301",
        inputType: "input",
        menuId: "6",
        required: false
      },
      {
        extra: "{\"enumOptions\":\"com.kabda.commons.common.enums.status.EnableStatus\"}",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Search",
        id: "302",
        inputType: "select",
        menuId: "6",
        required: false
      }
    ],
    sort: 10
  },
  {
    apiUrl: "/cmsApi/dept/addDept",
    beforeShowScript: "return { parentId: row.id, parentName: row.deptName}",
    buttonAction: "MODAL_FORM",
    buttonPosition: "ROW",
    columnFieldList: [],
    formFieldList: [
      {
        extra: "{\"disabled\":true}",
        fieldKey: "parentId",
        fieldLabel: "父级ID",
        fieldType: "Form",
        id: "341",
        inputType: "input",
        menuId: "14",
        required: true
      },
      {
        extra: "{\"disabled\":true}",
        fieldKey: "parentName",
        fieldLabel: "父级部门",
        fieldType: "Form",
        id: "342",
        inputType: "input",
        menuId: "14",
        required: true
      },
      {
        extra: "",
        fieldKey: "deptCode",
        fieldLabel: "部门Code",
        fieldType: "Form",
        id: "343",
        inputType: "input",
        menuId: "14",
        required: true
      },
      {
        extra: "",
        fieldKey: "deptName",
        fieldLabel: "部门名称",
        fieldType: "Form",
        id: "344",
        inputType: "input",
        menuId: "14",
        required: true
      },
      {
        extra: "{\"defaultValue\":10}",
        fieldKey: "sort",
        fieldLabel: "排序",
        fieldType: "Form",
        id: "345",
        inputType: "number",
        menuId: "14",
        required: true
      },
      {
        extra: "",
        fieldKey: "leader",
        fieldLabel: "负责人",
        fieldType: "Form",
        id: "346",
        inputType: "input",
        menuId: "14",
        required: false
      },
      {
        extra: "",
        fieldKey: "mobile",
        fieldLabel: "联系电话",
        fieldType: "Form",
        id: "347",
        inputType: "input",
        menuId: "14",
        required: false
      },
      {
        extra: "{\"defaultValue\":\"Enable\",\"enumOptions\":\"com.kabda.commons.common.enums.status.EnableStatus\"}",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Form",
        id: "348",
        inputType: "select",
        menuId: "14",
        required: true
      },
      {
        extra: "",
        fieldKey: "remark",
        fieldLabel: "备注",
        fieldType: "Form",
        id: "349",
        inputType: "input",
        menuId: "14",
        required: false
      }
    ],
    icon: "Plus",
    id: "14",
    idPath: "/3/4/12/14/",
    menuName: "添加下级部门",
    menuType: "BUTTON",
    parentId: "12",
    searchFieldList: [],
    sort: 10
  },
  {
    apiUrl: "/cmsApi/role/editRole",
    buttonAction: "MODAL_FORM",
    buttonPosition: "ROW",
    columnFieldList: [],
    formFieldList: [
      {
        extra: "{\"disabled\":true}",
        fieldKey: "id",
        fieldLabel: "角色ID",
        fieldType: "Form",
        id: "150",
        inputType: "input",
        menuId: "8",
        required: true
      },
      {
        extra: "{\"disabled\":true}",
        fieldKey: "roleCode",
        fieldLabel: "角色Code",
        fieldType: "Form",
        id: "151",
        inputType: "input",
        menuId: "8",
        required: true
      },
      {
        extra: "",
        fieldKey: "roleName",
        fieldLabel: "角色名称",
        fieldType: "Form",
        id: "152",
        inputType: "input",
        menuId: "8",
        required: true
      },
      {
        extra: "",
        fieldKey: "sort",
        fieldLabel: "排序",
        fieldType: "Form",
        id: "153",
        inputType: "number",
        menuId: "8",
        required: true
      },
      {
        extra: "{\"enumOptions\":\"com.kabda.commons.common.enums.status.EnableStatus\"}",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Form",
        id: "154",
        inputType: "select",
        menuId: "8",
        required: true
      },
      {
        extra: "",
        fieldKey: "remark",
        fieldLabel: "备注",
        fieldType: "Form",
        id: "155",
        inputType: "input",
        menuId: "8",
        required: false
      }
    ],
    icon: "Edit",
    id: "8",
    idPath: "/3/4/6/8/",
    menuName: "修改角色",
    menuType: "BUTTON",
    parentId: "6",
    searchFieldList: [],
    sort: 11
  },
  {
    apiUrl: "/cmsApi/dept/treeListDept",
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [
      {
        extra: "",
        fieldKey: "id",
        fieldLabel: "ID",
        fieldType: "Column",
        formatScript: "",
        id: "292",
        menuId: "12",
        showType: "TEXT",
        width: "10%"
      },
      {
        extra: "",
        fieldKey: "idPath",
        fieldLabel: "路径",
        fieldType: "Column",
        formatScript: "",
        id: "293",
        menuId: "12",
        showType: "TEXT",
        width: "20%"
      },
      {
        extra: "",
        fieldKey: "deptCode",
        fieldLabel: "部门Code",
        fieldType: "Column",
        formatScript: "",
        id: "294",
        menuId: "12",
        showType: "TEXT",
        width: "10%"
      },
      {
        extra: "",
        fieldKey: "deptName",
        fieldLabel: "部门名称",
        fieldType: "Column",
        formatScript: "",
        id: "295",
        menuId: "12",
        showType: "TEXT",
        width: "10%"
      },
      {
        extra: "",
        fieldKey: "leader",
        fieldLabel: "负责人",
        fieldType: "Column",
        formatScript: "",
        id: "296",
        menuId: "12",
        showType: "TEXT",
        width: "10%"
      },
      {
        extra: "",
        fieldKey: "mobile",
        fieldLabel: "联系电话",
        fieldType: "Column",
        formatScript: "",
        id: "297",
        menuId: "12",
        showType: "TEXT",
        width: "10%"
      },
      {
        extra: "",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Column",
        formatScript: "return value==='Enable'?'正常':value==='Disable'?'禁用':value",
        id: "298",
        menuId: "12",
        showType: "TAG",
        width: "10%"
      },
      {
        extra: "",
        fieldKey: "remark",
        fieldLabel: "备注",
        fieldType: "Column",
        formatScript: "",
        id: "299",
        menuId: "12",
        showType: "TEXT",
        width: ""
      }
    ],
    extra: "{\"rowKey\":\"id\",\"defaultExpandAll\":true,\"pagination\":false}",
    formFieldList: [],
    icon: "iconify:mingcute:department-line",
    id: "12",
    idPath: "/3/4/12/",
    menuName: "部门列表",
    menuType: "PAGE",
    pageType: "LIST",
    parentId: "4",
    routePath: "/sys/dept",
    searchFieldList: [],
    sort: 11
  },
  {
    apiUrl: "/cmsApi/dept/editDept",
    buttonAction: "MODAL_FORM",
    buttonPosition: "ROW",
    columnFieldList: [],
    formFieldList: [
      {
        extra: "{\"disabled\":true}",
        fieldKey: "id",
        fieldLabel: "ID",
        fieldType: "Form",
        id: "45",
        inputType: "input",
        menuId: "15",
        required: true
      },
      {
        extra: "{\"disabled\":true}",
        fieldKey: "parentId",
        fieldLabel: "上级部门ID",
        fieldType: "Form",
        id: "46",
        inputType: "input",
        menuId: "15",
        required: true
      },
      {
        extra: "",
        fieldKey: "deptCode",
        fieldLabel: "部门Code",
        fieldType: "Form",
        id: "47",
        inputType: "input",
        menuId: "15",
        required: true
      },
      {
        extra: "",
        fieldKey: "deptName",
        fieldLabel: "部门名称",
        fieldType: "Form",
        id: "48",
        inputType: "input",
        menuId: "15",
        required: true
      },
      {
        extra: "",
        fieldKey: "sort",
        fieldLabel: "排序",
        fieldType: "Form",
        id: "49",
        inputType: "number",
        menuId: "15",
        required: true
      },
      {
        extra: "",
        fieldKey: "leader",
        fieldLabel: "负责人",
        fieldType: "Form",
        id: "50",
        inputType: "input",
        menuId: "15",
        required: false
      },
      {
        extra: "",
        fieldKey: "mobile",
        fieldLabel: "联系电话",
        fieldType: "Form",
        id: "51",
        inputType: "input",
        menuId: "15",
        required: false
      },
      {
        extra: "{\"enumOptions\":\"com.kabda.commons.common.enums.status.EnableStatus\"}",
        fieldKey: "status",
        fieldLabel: "状态",
        fieldType: "Form",
        id: "52",
        inputType: "select",
        menuId: "15",
        required: true
      },
      {
        extra: "",
        fieldKey: "remark",
        fieldLabel: "备注",
        fieldType: "Form",
        id: "53",
        inputType: "input",
        menuId: "15",
        required: false
      }
    ],
    icon: "Edit",
    id: "15",
    idPath: "/3/4/12/15/",
    menuName: "修改部门",
    menuType: "BUTTON",
    parentId: "12",
    searchFieldList: [],
    sort: 11
  },
  {
    apiUrl: "/cmsApi/role/deleteRole",
    buttonAction: "CONFIRM",
    buttonPosition: "ROW",
    columnFieldList: [],
    formFieldList: [],
    icon: "Delete",
    id: "9",
    idPath: "/3/4/6/9/",
    menuName: "删除角色",
    menuType: "BUTTON",
    parentId: "6",
    searchFieldList: [],
    sort: 12
  },
  {
    apiUrl: "/cmsApi/dept/deleteDept",
    buttonAction: "CONFIRM",
    buttonPosition: "ROW",
    columnFieldList: [],
    formFieldList: [],
    icon: "Delete",
    id: "16",
    idPath: "/3/4/12/16/",
    menuName: "删除部门",
    menuType: "BUTTON",
    parentId: "12",
    searchFieldList: [],
    sort: 12
  },
  {
    apiUrl: "/cmsApi/role/assignRoleMenu",
    beforeShowScript: "const menuIds = await request.post('/cmsApi/role/roleMenus', {roleId: row.id})\nreturn {roleId:row.id, roleName:row.roleName, menuIds};",
    buttonAction: "MODAL_FORM",
    buttonPosition: "ROW",
    columnFieldList: [],
    extApiUrl: "/cmsApi/role/roleMenus,/cmsApi/menu/allMenuTree",
    extra: "{\"buttonType\":\"primary\"}",
    formFieldList: [
      {
        extra: "{\"disabled\":true}",
        fieldKey: "roleId",
        fieldLabel: "角色ID",
        fieldType: "Form",
        id: "338",
        inputType: "input",
        menuId: "36",
        required: true
      },
      {
        extra: "{\"disabled\":true}",
        fieldKey: "roleName",
        fieldLabel: "角色名称",
        fieldType: "Form",
        id: "339",
        inputType: "input",
        menuId: "36",
        required: true
      },
      {
        extra: "{\"queryUrl\":\"/cmsApi/menu/allMenuTree\",\"multiple\":true,\"checkStrictly\":false,\"showCheckbox\":true,\"collapseTags\":true,\"props\":{\"value\":\"id\",\"label\":\"menuName\",\"children\":\"children\"}}",
        fieldKey: "menuIds",
        fieldLabel: "菜单",
        fieldType: "Form",
        id: "340",
        inputType: "treeSelect",
        menuId: "36",
        required: false
      }
    ],
    icon: "iconify:grommet-icons:tree",
    id: "36",
    idPath: "/3/4/6/36/",
    menuName: "分配菜单",
    menuType: "BUTTON",
    parentId: "6",
    searchFieldList: [],
    sort: 13
  },
  {
    buttonAction: "MODAL_FORM",
    buttonPosition: "FOOTER",
    columnFieldList: [],
    formFieldList: [],
    icon: "CopyDocument",
    id: "37",
    idPath: "/3/37/",
    menuName: "文档",
    menuType: "DIRECTORY",
    parentId: "3",
    searchFieldList: [],
    sort: 100
  },
  {
    columnFieldList: [],
    formFieldList: [],
    icon: "ElementPlus",
    id: "33",
    idPath: "/3/37/33/",
    menuName: "ElementUI组件库",
    menuType: "PAGE",
    pageType: "OUTER_LINK",
    parentId: "37",
    routePath: "https://element-plus.org/zh-CN/component/overview",
    searchFieldList: [],
    sort: 102
  }
]

// 枚举选项数据
export const defaultEnumOptions: Record<string, { label: string; value: string }[]> = {
  "com.kabda.commons.common.enums.status.EnableStatus": [
    { label: "启用", value: "Enable" },
    { label: "禁用", value: "Disable" }
  ]
}

// 角色菜单关联数据 (roleId -> menuIds)
export const defaultRoleMenus: Record<string, string[]> = {
  "1": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "12", "13", "14", "15", "16", "20", "33", "34", "35", "36", "37"],
  "2": ["1", "2"]
}
