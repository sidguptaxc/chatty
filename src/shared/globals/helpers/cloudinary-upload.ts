import cloudinary, { UploadApiResponse, UploadApiErrorResponse} from 'cloudinary';

export function uploads(
	file: string,
	public_id?: string,
	overwrite?: boolean,
	invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
	return new Promise<UploadApiResponse | UploadApiErrorResponse | undefined>((resolve, reject) => {
				cloudinary.v2.uploader.upload(file, {
					public_id, overwrite, invalidate
				},
				(error, response) => {
					if (error) resolve(error);
					resolve(response )
				}
				)
	})
}
