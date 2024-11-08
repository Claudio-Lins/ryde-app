import { CustomButton } from '@/components/custom-button'
import { InputField } from '@/components/input-field'
import { OAuth } from '@/components/o-auth'
import { icons, images } from '@/constant'
import { fetchAPI } from '@/lib/fetch'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SignUpPage() {
	const { isLoaded, signUp, setActive } = useSignUp()
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [verification, setVerification] = useState({
		state: 'default',
		error: '',
		code: '',
	})
	const router = useRouter()

	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
	})

	const onSignUpPress = async () => {
		if (!isLoaded) {
			return
		}

		try {
			await signUp.create({
				emailAddress: form.email,
				password: form.password,
			})

			await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

			setVerification({ ...verification, state: 'pending' })
		} catch (err: any) {
			Alert.alert('Error', err.errors[0].longMessage)
		}
	}

	const onPressVerify = async () => {
		if (!isLoaded) {
			return
		}

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code: verification.code,
			})

			if (completeSignUp.status === 'complete') {
				await fetchAPI('/(api)/user', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: form.name,
						email: form.email,
						clerkId: completeSignUp.createdUserId,
					}),
				})
				await setActive({ session: completeSignUp.createdSessionId })
				setVerification({ ...verification, state: 'success' })
			} else {
				setVerification({ ...verification, error: 'Verification failed', state: 'failed' })
			}
		} catch (err: any) {
			setVerification({ ...verification, error: err.errors[0].longMessage, state: 'failed' })
		}
	}

	return (
		<ScrollView className='flex-1 bg-white'>
			<View className='flex-1 bg-white'>
				<View className='relative w-full h-[250px]'>
					<Image source={images.signUpCar} className='w-full z-0 h-[250px]' />
					<Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>
						Create Your Account
					</Text>
				</View>
				<View className='p-5'>
					<InputField
						label='Name'
						placeholder='Enter your name'
						icon={icons.person}
						value={form.name}
						onChangeText={(value) => setForm({ ...form, name: value })}
					/>
					<InputField
						label='Email'
						placeholder='Enter your email'
						icon={icons.email}
						value={form.email}
						onChangeText={(value) => setForm({ ...form, email: value })}
					/>
					<InputField
						label='Password'
						placeholder='Enter your password'
						icon={icons.lock}
						secureTextEntry
						value={form.password}
						onChangeText={(value) => setForm({ ...form, password: value })}
					/>
					<CustomButton title='Sign Up' onPress={onSignUpPress} className='mt-6' />

					<OAuth />

					<Link href='/sign-in' className='text-lg text-center text-general-200 mt-10'>
						<Text className=''>Already have an account?</Text>
						<Text className='text-primary-500'>Log In</Text>
					</Link>
				</View>
				{/* Verification Modal */}
				<ReactNativeModal
					isVisible={verification.state === 'pending'}
					onModalHide={() => {
						if (verification.state === 'success') setShowSuccessModal(true)
					}}
				>
					<View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
						<Text className='text-2xl font-JakartaExtraBold mb-2'>Verification!</Text>
						<Text className='text-base font-Jakarta leading-snug mb-5'>
							We've sent a verification code to {form.email}
						</Text>
						<InputField
							label='Verification Code'
							placeholder='12345'
							icon={icons.lock}
							value={verification.code}
							keyboardType='numeric'
							onChangeText={(code) => setVerification({ ...verification, code: code })}
						/>
						{verification.error && (
							<Text className='text-sm font-Jakarta text-red-500 mt-2'>{verification.error}</Text>
						)}
						<CustomButton title='Verify' onPress={onPressVerify} className='mt-5 bg-success-500' />
					</View>
				</ReactNativeModal>
				<ReactNativeModal isVisible={showSuccessModal}>
					<View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
						<Image source={images.check} className='w-28 h-28 mx-auto my-5' />
						<Text className='text-3xl font-JakartaBold text-center'>Verify!</Text>
						<Text className='text-base font-Jakarta text-zinc-500 mt-2 leading-snug text-center'>
							You have successfully signed up. Check your email to verify your account.
						</Text>
						<CustomButton
							title='Browse Home'
							onPress={() => {
								setShowSuccessModal(false)
								router.push('/(root)/(tabs)/home')
							}}
							className='mt-5'
						/>
					</View>
				</ReactNativeModal>
			</View>
		</ScrollView>
	)
}
