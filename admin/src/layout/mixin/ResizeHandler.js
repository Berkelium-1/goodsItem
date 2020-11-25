import store from '@/store'

const { body } = document;
const WIDTH = 992; // 参考 Bootstrap 的响应式设计
export default {
    watch: {
        $route(route) {
            if (this.device === 'mobile' && this.sidebar.opened) {
                store.dispatch('app/closeSideBar', { withoutAnimation: false })
            }
        }
    },
    beforeMount() {
        window.addEventListener('resize', this.$_resizeHandler)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.$_resizeHandler)
    },
    mounted() {
        const isMobile = this.$_isMobile()
        if (isMobile) {
            store.dispatch('app/toggleDevice', 'mobile')
            store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
    },
    methods: {
        // use $_ for mixins properties
        // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
        $_isMobile() { // 是否为手机尺寸
            const rect = body.getBoundingClientRect()
            return rect.width - 1 < WIDTH
        },
        $_resizeHandler() { // 调整大小处理
            if (!document.hidden) {
                const isMobile = this.$_isMobile()
                store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop');

                if (isMobile) {
                    store.dispatch('app/closeSideBar', { withoutAnimation: true });
                }
            }
        }
    }
}