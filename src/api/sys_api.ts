import request from "./request";

/**
 * 系统相关API
 */
export const sysApi = {
    /**
     * 根据枚举 获取下拉框
     */
    getEnumOptions(className: string): Promise<{ label: string; value: any }[]> {
        return request.post('/cmsApi/sys/selector/listOptionsByEnum', {
            className
        })
    },

}