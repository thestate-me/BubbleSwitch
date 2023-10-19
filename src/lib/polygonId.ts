import { AuthorizationRequestMessage } from '@0xpolygonid/js-sdk';
import { auth, resolver } from '@iden3/js-iden3-auth';

export function KYCAgeCredential(credentialSubject: object) {
  return {
    id: 1,
    circuitId: 'credentialAtomicQuerySigV2',
    query: {
      allowedIssuers: ['*'],
      type: 'KYCAgeCredential',
      context:
        'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
      credentialSubject,
    },
  };
}

export async function generateQr(
  id: string,
  reason: string,
  credentialSubject: object
) {
  const request = auth.createAuthorizationRequest(
    reason,
    process.env.POLYGON_VERIFIER_DID || '',
    `${process.env.BASE_URL}api/polygon/callback`
  );

  request.id = id;
  request.thid = id;

  const proofRequest = KYCAgeCredential(credentialSubject);

  const scope = request.body.scope ?? [];
  request.body.scope = [...scope, proofRequest];

  return request;
}

export async function verify(
  token: string,
  request: AuthorizationRequestMessage
) {
  const ethStateResolver = new resolver.EthStateResolver(
    process.env.POLYGON_RPC_URL || '',
    process.env.POLYGON_CONTRACT_ADDR || ''
  );

  const stateResolver = {
    [process.env.POLYGON_RESOLVER || 'polygon:mumbai']: ethStateResolver,
  };

  const verifier = await auth.Verifier.newVerifier({
    stateResolver,
    circuitsDir: 'keys',
  });

  const response = await verifier.fullVerify(token, request, {
    acceptedStateTransitionDelay: 5 * 60 * 1000,
    acceptedProofGenerationDelay: 1 * 365 * 24 * 60 * 60 * 1000,
  });

  return response;
}
