import { icons } from '@/constant'
import { Image, Text, View } from 'react-native'
import { CustomButton } from './custom-button'

export function OAuth() {
	async function handleGoogleSignIn() {
		console.log('Google Sign In')
	}
	return (
		<View className=''>
			<View className='flex flex-row justify-center items-center mt-4 gap-x-3'>
				<View className='flex-1 h-[1px] bg-general-100' />
				<Text className='text-general-200 text-lg font-JakartaSemiBold'>Or</Text>
				<View className='flex-1 h-[1px] bg-general-100' />
			</View>
			<CustomButton
				title='Sign In with Google'
				className='mt-5 w-full shadow-none'
				IconLeft={() => (
					<Image source={icons.google} resizeMode='contain' className='size-5 mx-2' />
				)}
				bgVariant='outline'
				textVariant='primary'
				onPress={handleGoogleSignIn}
			/>
		</View>
	)
}
