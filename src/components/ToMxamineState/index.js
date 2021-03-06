export function toMxAmina(item) {
  switch (item.fdocumentStatus) {
    case 'A':
      item.fdocumentStatus = '创建'
      break
    case 'B':
      item.fdocumentStatus = '审核中'
      break
    case 'C':
      item.fdocumentStatus = '已审核'
      break
    case 'D':
      item.fdocumentStatus = '重新审核'
      break
    case 'E':
      item.fdocumentStatus = '暂存'
      break
    default:
      item.fdocumentStatus = '创建'
  }
  return item
}
export function toDocument(item) {
  switch (item.FDOCUMENTSTATUS) {
    case 'A':
      item.FDOCUMENTSTATUS = '创建'
      break
    case 'B':
      item.FDOCUMENTSTATUS = '审核中'
      break
    case 'C':
      item.FDOCUMENTSTATUS = '已审核'
      break
    case 'D':
      item.FDOCUMENTSTATUS = '重新审核'
      break
    default:
      item.FDOCUMENTSTATUS = '创建'
  }
  return item
}

export function Disable(item) {
  switch (item.fforbidStatus) {
    case 'A':
      item.fforbidStatus = '否'
      break
    case 'B':
      item.fforbidStatus = '是'
      break
    default:
      item.fforbidStatus = '否'
  }
  return item
}
export function Forbid(item) {
  switch (item.FFORBIDSTATUS) {
    case 'A':
      item.FFORBIDSTATUS = '否'
      break
    case 'B':
      item.FFORBIDSTATUS = '是'
      break
    default:
      item.FFORBIDSTATUS = '否'
  }
  return item
}

export function userDisable(item) {
  switch (item.ISDISABLE) {
    case 0:
      item.ISDISABLE = '否'
      break
    case 1:
      item.ISDISABLE = '是'
      break
    default:
      item.ISDISABLE = '否'
  }
  return item
}
