<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBackground from '@/components/background.vue'
import { useHomeStore } from '@/stores/home'
import { useLoginStore } from '@/stores/login'

defineOptions({
  name: 'HomeIndex',
})
// 路由
const router = useRouter()
// 用户隐私存储
const homeStore = useHomeStore()
// 登录存储
const loginStore = useLoginStore()
// 表单数据
const form = ref({
  name: '',
  department: '',
})
// chebox
const isShowTip = ref<boolean>(false)
const isAnimating = ref<boolean>(false)
// 发送弹幕
const handleSendBarrageClick = async () => {
  // if (!homeStore.privacyCheckbox) {
  //   isShowTip.value = true
  //   return
  // }
  if (!form.value.name || !form.value.department) {
    return
  }
  await loginStore.actionPostToekn({
    name: form.value.name,
    department: form.value.department,
  })
  router.push('/send_barrage')
}
// 监听复选框变化
watch(
  () => homeStore.privacyCheckbox,
  (newValue) => {
    if (newValue) {
      isShowTip.value = false
    }
  },
)

// 监听提示显示状态，触发动画
watch(isShowTip, (newValue) => {
  if (newValue) {
    // 强制重排以确保动画每次都能触发
    isAnimating.value = false
    // 使用$nextTick确保DOM更新后再触发动画
    setTimeout(() => {
      isAnimating.value = true
    }, 10)
  }
})

// 图片动画控制
const imageAnimation = ref<string>('')

// 组件挂载后触发图片动画
onMounted(() => {
  imageAnimation.value = 'fly-in'
})
</script>

<template>
  <AppBackground>
    <!-- 首页顶部导航 -->
    <!-- <header class="flex items-center justify-between !px-6 !pt-8 !pb-4">
      <div class="iconfont icon-bilibili text-[#e84075] !text-4xl"></div>
      <img src="@/assets/images/logo.png" alt="logo" class="w-30" />
    </header> -->
    <!-- 首页主要内容 -->
    <main class="flex flex-1 flex-col items-center justify-start w-full !mt-[22rem]">
      <form class="relative w-full !px-[59px]">
        <div class="flex items-center">
          <label for="name" class="text-white text-[1.6rem] mr-[8px] whitespace-nowrap">姓名</label>
          <input
            id="name"
            v-model="form.name"
            class="flex-1 border-2 border-[#00BAFF] rounded-xl px-4 py-2 h-[37px] text-[1.4rem] w-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            type="text"
          />
        </div>
        <div class="flex items-center mt-[34px]">
          <label for="department" class="text-white text-[1.6rem] mr-[8px] whitespace-nowrap"
            >部门</label
          >
          <input
            id="department"
            v-model="form.department"
            class="flex-1 border-2 border-[#00BAFF] rounded-xl px-4 py-2 h-[37px] text-[1.4rem] w-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            type="text"
          />
        </div>
        <!-- 16:9 比例的视频尺寸容器 (使用Tailwind CSS) -->
        <!-- <div class="w-full relative overflow-hidden">
          <div :class="['w-full h-full animate-' + imageAnimation]">
            <img
              class="object-fill w-full h-full"
              src="@/assets/images/large_screen.png"
              alt="large_screen"
            />
          </div>
        </div> -->
      </form>
      <div class="w-[169px] mt-[50px]" @click="handleSendBarrageClick">
        <img src="@/assets/images/button-text-comfirm.png" alt="btn" />
      </div>
    </main>
  </AppBackground>
</template>

<style scoped>
/* 自定义复选框样式 */
#privacy-checkbox:checked + .relative .border-\[\#815c48\] {
  background-color: #815c48;
}

#privacy-checkbox:checked + .relative .opacity-0 {
  opacity: 1;
}

/* 抖动动画 */
.animate-shake {
  animation: shake 0.6s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

/* 图片飞入动画 */
.animate-fly-in {
  animation: flyIn 1s forwards;
}

@keyframes flyIn {
  from {
    /* 初始状态：小尺寸、透明、在远处 */
    opacity: 0;
    transform: scale(0.8) translateZ(-10px);
  }
  to {
    /* 结束状态：正常尺寸、完全清晰、当前位置 */
    opacity: 1;
    transform: scale(1) translateZ(0);
  }
}
</style>
