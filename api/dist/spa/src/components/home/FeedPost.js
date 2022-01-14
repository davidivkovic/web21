import { transformDate } from '/src/components/utility/dates.js'
import CommentOutline from '/src/icons/CommentOutline.js'
import HeartIconOutline from '/src/icons/HeartIconOutline.js'
import ShareIcon from '/src/icons/ShareIcon.js'
export default {
  template: `  
  	<article class="w-full rounded-sm border border-gray-300 text-sm bg-white">
  		<section class="h-16 flex items-center p-4 space-x-3">
  			<img :src="post.poster.imageURL" alt="Profile picture" class="w-8 h-8 rounded-full" />
  			<span class="font-medium">miyayeah</span>
  		</section>
  		<section>
  			<img :src="post.imageURL" alt="Profile picture" class="w-full" />
  		</section>
  		<section class="p-4 space-y-2">
  			<div class="flex items-center space-x-4">
  				<HeartIconOutline />
  				<RouterLink :to="{ name: 'post', params: { id: post.id } }">
  					<CommentOutline class="text-black" />
  				</RouterLink>
  				<ShareIcon />
  			</div>
  			<div class="font-medium">{{ post.commentCount }} comments</div>
  			<div class="space-y-1">
  				<div class="flex space-x-1">
  					<span class="font-medium">{{ post.poster.username }}</span>
  					<div>{{ post.caption }}</div>
  				</div>
  				<div class="text-gray-400 text-xs">{{ transformDate(post.timestamp) }}</div>
  			</div>
  			<div>
  				<RouterLink :to="{ name: 'post', params: { id: post.id } }">
  					<div class="text-gray-400">View all {{ post.commentsCount }} comments</div>
  				</RouterLink>
  			</div>
  		</section>
  	</article>
  `,
  components: {
    CommentOutline,
    HeartIconOutline,
    ShareIcon,
  },
  props: {
    post: {
      type: Object,
    },
  },

  setup() {
    return {
      transformDate,
    }
  },
}
