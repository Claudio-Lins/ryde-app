import { CustomButton } from '@/components/custom-button'
import { onboarding } from '@/constant'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-swiper'

export default function OnboardingPage() {
	const swiperRef = useRef<Swiper>(null)
	const [activeIndex, setActiveIndex] = useState(0)
	return (
		<SafeAreaView className='flex h-full justify-between items-center'>
			<TouchableOpacity
				onPress={() => {
					router.replace('/(auth)/sign-up')
				}}
				className='w-full flex justify-end items-end p-4'
			>
				<Text className='text-black text-sm font-JakartaBold '>Skip</Text>
			</TouchableOpacity>
			<Swiper
				ref={swiperRef}
				loop={false}
				dot={<View className='w-8 h-1 mx-1 bg-zinc-300 rounded-full' />}
				activeDot={<View className='w-8 h-1 mx-1 bg-blue-800 rounded-full' />}
				onIndexChanged={(index) => setActiveIndex(index)}
			>
				{onboarding.map((item) => (
					<View key={item.id} className='flex items-center justify-center p-5'>
						<Image source={item.image} className='w-full h-[300px]' resizeMode='contain' />
						<View className='flex flex-row items-center justify-center w-fll mt-10'>
							<Text className='text-black text-3xl font-bold mx-10 text-center'>{item.title}</Text>
						</View>
						<Text className='text-lg font-JakartaSemiBold text-center text-zinc-400 mx-10 mt-3'>
							{item.description}
						</Text>
					</View>
				))}
			</Swiper>
			<CustomButton
				onPress={() => {
					if (activeIndex < onboarding.length - 1) {
						swiperRef.current?.scrollBy(1)
					} else {
						router.replace('/(auth)/sign-up')
					}
				}}
				title={activeIndex < onboarding.length - 1 ? 'Next' : 'Get Started'}
				className='mt-10'
			/>
		</SafeAreaView>
	)
}
