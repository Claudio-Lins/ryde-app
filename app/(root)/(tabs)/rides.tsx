import { useUser } from '@clerk/clerk-expo'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RideCard } from '@/components/ride-card'
import { images } from '@/constant'
import { useFetch } from '@/lib/fetch'
import { RideTypes } from '@/types/type'

export default function Rides() {
	const { user } = useUser()

	const { data: recentRides, loading, error } = useFetch<RideTypes[]>(`/(api)/ride/${user?.id}`)

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<FlatList
				data={recentRides}
				renderItem={({ item }) => <RideCard ride={item} />}
				keyExtractor={(item, index) => index.toString()}
				className='px-5'
				keyboardShouldPersistTaps='handled'
				contentContainerStyle={{
					paddingBottom: 100,
				}}
				ListEmptyComponent={() => (
					<View className='flex flex-col items-center justify-center'>
						{!loading ? (
							<>
								<Image
									source={images.noResult}
									className='w-40 h-40'
									alt='No recent rides found'
									resizeMode='contain'
								/>
								<Text className='text-sm'>No recent rides found</Text>
							</>
						) : (
							<ActivityIndicator size='small' color='#000' />
						)}
					</View>
				)}
				ListHeaderComponent={
					<>
						<Text className='text-2xl font-JakartaBold my-5'>All Rides</Text>
					</>
				}
			/>
		</SafeAreaView>
	)
}