export { default as AgregarUsuario } from '../..\\components\\AgregarUsuario.vue'
export { default as BatchInfo } from '../..\\components\\BatchInfo.vue'
export { default as EditarUsuario } from '../..\\components\\EditarUsuario.vue'
export { default as EliminarUsuario } from '../..\\components\\EliminarUsuario.vue'
export { default as ModalProduccion } from '../..\\components\\ModalProduccion.vue'
export { default as NewPassword } from '../..\\components\\NewPassword.vue'
export { default as Notifier } from '../..\\components\\Notifier.vue'
export { default as NuxtLogo } from '../..\\components\\NuxtLogo.vue'
export { default as ProductList } from '../..\\components\\Product_List.vue'
export { default as Stepper } from '../..\\components\\Stepper.vue'
export { default as Tutorial } from '../..\\components\\Tutorial.vue'
export { default as VuetifyLogo } from '../..\\components\\VuetifyLogo.vue'
export { default as LayoutMenuNavabar } from '../..\\components\\Layout\\Menu_navabar.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
