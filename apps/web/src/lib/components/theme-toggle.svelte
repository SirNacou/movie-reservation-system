<script lang="ts">
import { Button } from '$lib/components/ui/button/index.js'
import { toggleMode } from 'mode-watcher'
import MoonIcon from '~icons/lucide/moon'
import SunIcon from '~icons/lucide/sun'
</script>

<Button onclick={toggleMode} variant="outline" size="icon">
	<SunIcon class="rotate-0 dark:-rotate-90 scale-100 dark:scale-0 transition-all!" />
	<MoonIcon class="absolute rotate-90 dark:rotate-0 scale-0 dark:scale-100 transition-all!" />
	<span class="sr-only">Toggle theme</span>
</Button>
