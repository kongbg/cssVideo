import request from '@/utils/request'

// 获取跨区域平衡处置登记待办事项
export function getbusiDisposalProveCount(data) {
  return request({
    url: '/api/workbench/busiDisposalProve/count',
    method: 'post',
    data: data
  })
}
