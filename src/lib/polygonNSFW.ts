import {
  AuthorizationRequestMessage,
  cacheLoader,
  CircuitData,
  CircuitId,
  CircuitStorage,
  InMemoryDataSource,
  NativeProver,
  PackageManager,
} from '@0xpolygonid/js-sdk';
import { auth, resolver } from '@iden3/js-iden3-auth';
import { format, subYears } from 'date-fns';

import authV2 from '../../circuits/authV2/verification_key.json';
import atomicQuerySigV2 from '../../circuits/authV2/verification_key.json';

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

export function generateRequest(
  userAddr: string,
  reason: string,
  birthday?: number
) {
  const bd = birthday || parseInt(format(subYears(new Date(), 18), 'yyyyMMdd'));

  const request = auth.createAuthorizationRequest(
    reason,
    process.env.POLYGON_VERIFIER_DID || '',
    `${process.env.BASE_URL}api/polygon/nsfw/verify?userAddr=${userAddr}&birthday=${bd}`
  );

  request.id = userAddr;
  request.thid = userAddr;

  const proofRequest = KYCAgeCredential({
    birthday: {
      $lt: bd,
    },
  });

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

  const dataSource = new InMemoryDataSource<CircuitData>();
  const circuitStorage = new CircuitStorage(dataSource);

  circuitStorage.saveCircuitData(CircuitId.AuthV2, {
    circuitId: CircuitId.AuthV2,
    verificationKey: Buffer.from(JSON.stringify(authV2)),
    wasm: null,
    provingKey: null,
  });

  circuitStorage.saveCircuitData(CircuitId.AtomicQuerySigV2, {
    circuitId: CircuitId.AtomicQuerySigV2,
    verificationKey: Buffer.from(JSON.stringify(atomicQuerySigV2)),
    wasm: null,
    provingKey: null,
  });

  const verifier = await auth.Verifier.newVerifier({
    stateResolver,
    suite: {
      documentLoader: cacheLoader(),
      circuitStorage,
      prover: new NativeProver(circuitStorage),
      packageManager: new PackageManager(),
    },
  });

  const response = await verifier.fullVerify(token, request, {
    acceptedStateTransitionDelay: 5 * 60 * 1000,
    acceptedProofGenerationDelay: 1 * 365 * 24 * 60 * 60 * 1000,
  });

  return response;
}
