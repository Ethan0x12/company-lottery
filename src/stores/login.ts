import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { WechatUserInfoResponse, WechatAuthScope } from '@/types'
import { getWechatUserInfo, postMemberToken } from '@/api'

export const useLoginStore = defineStore('login', () => {
  // 微信用户信息
  const wechatUserInfo = ref<WechatUserInfoResponse | null>(null)
  // token
  let token: string = ''
  // 公司ID
  const company_id: string = '1702549419'
  // 部门编码
  const dep_code: string = '678_'
  // 直播id
  const live_id: string = '35'
  // 授权范围
  const scope: WechatAuthScope = 'snsapi_userinfo'

  // 初始化时从localStorage加载用户信息
  const storedUserInfo = localStorage.getItem('wechatUserInfo')
  if (storedUserInfo) {
    wechatUserInfo.value = JSON.parse(storedUserInfo) as WechatUserInfoResponse
  }

  // 是否已登录
  const isLoggedIn = computed(() => {
    return wechatUserInfo.value !== null
  })

  // 获取微信用户信息
  async function actionGetUserInfo(code: string) {
    try {
      const userInfo = (await getWechatUserInfo({
        code,
        company_id,
        scope,
      })) as WechatUserInfoResponse
      setWechatUserInfo(userInfo)

      return userInfo
    } catch (error) {
      // 处理业务错误
      console.error('获取用户信息失败:', error)
      return Promise.reject(new Error('获取用户信息失败:' + error))
    }
  }

  // 登录获取token
  async function actionPostToekn(form: { name: string; department: string }) {
    if (!wechatUserInfo.value) {
      throw new Error('用户信息未初始化')
    }
    const openId = wechatUserInfo.value?.open_id
    const username = wechatUserInfo.value?.name
    const avatar = wechatUserInfo.value?.avatar
    const nick_name = wechatUserInfo.value?.nick_name
    if (!openId) {
      throw new Error('openid 为空')
    }
    const memberToken = (await postMemberToken(
      { company_id, dep_code, live_id },
      {
        login_field: 'openid',
        login_value: openId,
        openid: openId,
        name: form.name || '',
        avatar: avatar || '',
        nick_name: nick_name || '',
        login_type: 'update',
        department: form.department || '',
      },
    )) as {
      token: string
      membership_code: string
    }
    setToken(memberToken.token)
  }

  // 设置微信用户信息
  function setWechatUserInfo(userInfo: WechatUserInfoResponse | null) {
    localStorage.setItem('wechatUserInfo', JSON.stringify(userInfo))
    wechatUserInfo.value = userInfo
  }

  // 设置用户token
  function setToken(value: string) {
    localStorage.setItem('token', value)
    token = value
  }

  // 清空用户信息（退出登录）
  function clearUserInfo() {
    localStorage.removeItem('wechatUserInfo')
    localStorage.removeItem('token')
    wechatUserInfo.value = null
    token = ''
  }

  return {
    wechatUserInfo,
    token,
    company_id,
    dep_code,
    live_id,
    isLoggedIn,
    actionGetUserInfo,
    actionPostToekn,
    // actionGetAuthUrl,
    setWechatUserInfo,
    setToken,
    clearUserInfo,
  }
})
