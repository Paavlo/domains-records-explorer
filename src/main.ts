import { createApp } from 'vue'

import App from './App.vue'

// Global components
import BaseTextField from '@/components/BaseTextField.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect.vue'

const app = createApp(App)

app
  .component('cs-text-field', BaseTextField)
  .component('cs-button', BaseButton)
  .component('de-select', BaseSelect)

app.mount('#app')
