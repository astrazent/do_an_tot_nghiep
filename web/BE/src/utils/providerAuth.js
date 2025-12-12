import { env } from '~/config/environment'
import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)

export const verifyGoogleToken = async tokenId => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: env.GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload()

        return {
            email: payload.email,
            full_name: payload.name,
            first_name: payload.given_name,
            last_name: payload.family_name,
            googleId: payload.sub,
            avatar_url: payload.picture,
            email_verified: payload.email_verified,
        }
    } catch (error) {
        throw new Error('Invalid Google token')
    }
}
