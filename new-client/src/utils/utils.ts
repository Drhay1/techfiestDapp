import { IdStatement, IdProofOutput } from '@concordium/web-sdk';

export const randomNumberGenerator = () => {
  return Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 100)) + 100;
};

export function isScientificNotation(number: any) {
  var numberString = number.toString();
  return numberString.includes('e') || numberString.includes('E');
}

/**
 * Fetch the item names from the backend
 */
export async function getNames(verifier: string): Promise<string[]> {
  const response = await fetch(`${verifier}/names`, { method: 'get' });
  const body = await response.json();
  return JSON.parse(body);
}

/**
 * Fetch a challenge from the backend
 */
export async function getChallenge(verifier: string, accountAddress: string) {
  const response = await fetch(
    `${verifier}/challenge?address=` + accountAddress,
    { method: 'get' },
  );
  const body = await response.json();
  return body.challenge;
}

/**
 * Fetch the statement to prove from the backend
 */
export async function getStatement(verifier: string): Promise<IdStatement> {
  const response = await fetch(`${verifier}/statement`, { method: 'get' });
  const body = await response.json();
  return body;
}

/**
 *  Authorize with the backend, and get a auth token.
 */
export async function authorize(
  verifier: string,
  challenge: string,
  proof: IdProofOutput,
) {
  const response = await fetch(`${verifier}/prove`, {
    method: 'post',
    headers: new Headers({ 'content-type': 'application/json' }),
    body: JSON.stringify({ challenge, proof }),
  });
  if (!response.ok) {
    throw new Error('Unable to authorize');
  }
  const body = await response.json();
  if (body) {
    return body;
  }
  throw new Error('Unable to authorize');
}
