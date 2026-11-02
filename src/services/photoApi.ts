// Uploading a report photo (operationId uploadPhoto): multipart, field "file". The
// report is created afterwards with the returned photoId, which a retry reuses.
// Photos are shown through the photoUrl the server returns, never a URL built here.
import { api } from '@/services/api'
import type { PhotoView } from '@/types/ekowatch'

export const photoApi = api.injectEndpoints({
  endpoints: (build) => ({
    uploadPhoto: build.mutation<PhotoView, File>({
      query: (file) => {
        const body = new FormData()
        body.append('file', file)
        return { url: '/photos', method: 'POST', body }
      },
    }),
  }),
})

export const { useUploadPhotoMutation } = photoApi
