'use client';
import React, { useState, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
	maxSizeMB?: number;
	onImageUpload?: (file: File) => void;
}

const ImageUploader = ({
	maxSizeMB = 5,
	onImageUpload,
}: ImageUploaderProps) => {
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const validateFile = (file: File): boolean => {
		const maxSizeBytes = maxSizeMB * 1024 * 1024;

		if (!file.type.startsWith('image/')) {
			setError('Please upload an image file');
			return false;
		}

		if (file.size > maxSizeBytes) {
			setError(`File size should be less than ${maxSizeMB}MB`);
			return false;
		}

		return true;
	};

	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setError(null);

		if (file) {
			if (validateFile(file)) {
				setSelectedImage(file);
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreviewUrl(reader.result as string);
				};
				reader.readAsDataURL(file);
				onImageUpload?.(file);
			}
		}
	};

	const removeImage = (): void => {
		setSelectedImage(null);
		setPreviewUrl(null);
		setError(null);
	};
	const fileTypes = "audio/', video/*,image/*";
	return (
		<div className="flex flex-col items-center gap-6 p-6 max-w-md mx-auto">
			<label
				htmlFor="image-upload"
				className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
			>
				<Upload size={20} />
				Upload Image
			</label>

			<input
				id="image-upload"
				type="file"
				accept={fileTypes}
				onChange={handleImageUpload}
				className="hidden"
			/>

			{error && <div className="text-red-500 text-sm">{error}</div>}

			{previewUrl ? (
				<div className="w-full relative">
					<img
						src={previewUrl}
						alt="Uploaded preview"
						className="w-full h-auto rounded-lg shadow-lg"
					/>
					<button
						onClick={removeImage}
						className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
					>
						Remove
					</button>
				</div>
			) : (
				<div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500">
					No image uploaded
				</div>
			)}
		</div>
	);
};

export default ImageUploader;
