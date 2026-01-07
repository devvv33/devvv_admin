/**
 * 菜单类型枚举
 */
export enum MenuType {
  /** 模块 - 顶级模块目录，在系统顶部展示 */
  MODULE = 'MODULE',
  /** 目录 - 模块下的功能分类文件夹，在左侧作为文件夹展示 */
  DIRECTORY = 'DIRECTORY',
  /** 页面 - 具体的功能页面，在左侧作为文件展示 */
  PAGE = 'PAGE',
  /** 按钮 - 页面内的具体按钮资源 */
  BUTTON = 'BUTTON',
}

/**
 * 页面类型枚举
 */
export enum PageType {
  /** 列表页面 - 展示数据表格 */
  LIST = 'LIST',
  /** 自定义页面 - 开发者自行开发页面内容 */
  CUSTOM = 'CUSTOM',
  /** 外部页面 - 打开外部页面, 要求路径是绝对路径 */
  OUTER_LINK = 'OUTER_LINK'
}

/**
 * 字段展示类型枚举
 */
export enum FieldShowType {
  /** 文本 */
  TEXT = 'TEXT',
  /** 标签 */
  TAG = 'TAG',
  /** 图片 */
  IMAGE = 'IMAGE',
  /** 视频 */
  VIDEO = 'VIDEO',
  /** 音频 */
  AUDIO = 'AUDIO',
  /** 链接 */
  LINK = 'LINK',
}

/**
 * 按钮所在位置
 */
export enum ButtonPosition {
  /** 行级按钮 - 出现在数据表格的每一行 */
  ROW = 'ROW',
  /** 底部按钮 - 出现在数据表格的底部 */
  FOOTER = 'FOOTER',
}

/**
 * 按钮操作类型枚举
 */
export enum ButtonActionType {
  /** 弹窗表单 */
  MODAL_FORM = 'MODAL_FORM',
  /** 弹窗列表 */
  MODAL_LIST = 'MODAL_LIST',
  /** 确认框 */
  CONFIRM = 'CONFIRM',
  /** 提示框 */
  TIPS = 'TIPS',
  /** 打开新页面 */
  PAGE = 'PAGE',
  /** 导出列表（包含列表查询参数） */
  EXPORT = 'EXPORT',
  /** 下载文件 */
  DOWNLOAD = 'DOWNLOAD',
}

/**
 * 菜单项接口
 */
export interface MenuItem {
  /** 菜单唯一标识 */
  id: string
  /** 父级菜单id */
  parentId: string
  idPath: string
  /** 菜单名称 */
  menuName: string
  /** 菜单类型 */
  menuType: MenuType
  /** 图标 */
  icon?: string
  /** 排序 */
  sort: number
  /** 路由路径（仅页面类型需要） */
  routePath?: string | null

  /** 页面类型（仅页面类型需要） */
  pageType?: PageType | null
  /** 后端接口地址（当menuType=BUTTON且pageType=LIST时为列表查询接口，当menuType=BUTTON时为按钮操作接口） */
  apiUrl?: string
  /** 扩展的鉴权api接口 */
  extApiUrl?: string
  /** 额外配置，JSON字符串格式 */
  extra?: string

  /** ---------- 作为【自定义页面】时的相关字段 ---------- */
  /** 自定义页面的组件, 与 /src/views/custom 下的组件匹配 */
  customComponent?: string

  /** ---------- 作为【列表页面】时的相关字段 ---------- */
  /** 查询字段配置（当pageType=LIST时） */
  searchFieldList?: PageField[]
  /** 列表字段配置（当pageType=LIST时） */
  columnFieldList?: PageField[]

  /** ---------- 作为【按钮】时的相关字段 ---------- */
  /** 按钮位置 */
  buttonPosition: ButtonPosition
  /** 按钮操作类型 */
  buttonActionType: ButtonActionType
  buttonAction: ButtonActionType
  /** 回显前的操作 */
  beforeShowScript?: string
  /** 提交前的操作 */
  beforeSubmitScript?: string
  /** 表单字段配置（弹窗类型需要） */
  formFieldList?: PageField[]

  /** 子菜单列表 */
  children?: MenuItem[]
}

/**
 * 列表字段配置
 */
export interface PageField {
  id: string
  menuId: string
  /** 字段名 */
  fieldKey: string
  /** 描述 */
  fieldLabel: string
  /** 字段类型 */
  fieldType: string

  /** 是否必须 */
  required?: boolean
  /** 输入框类型：input, select, date, dateRange等 */
  inputType: string
  /** 字段展示类型 */
  showType?: FieldShowType
  /** 列宽度 */
  width?: string
  /** 字段格式化JS代码，value为当前字段值，返回格式化后的值 */
  formatScript?: string

  /** 额外配置，JSON字符串格式 */
  extra?: string
}

