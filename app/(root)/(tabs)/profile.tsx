import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Profile() {
	return (
		<SafeAreaView className='flex-1 justify-center items-center'>
			<Text className='text-primary-500'>Profile</Text>
		</SafeAreaView>
	)
}
