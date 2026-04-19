import type { APIErrorCode as BaseAuthErrorCode } from 'better-auth'
import type { admin } from 'better-auth/plugins'

const baseErrors: Record<BaseAuthErrorCode, string> = {
  ACCOUNT_NOT_FOUND: 'Conta não encontrada.',
  ASYNC_VALIDATION_NOT_SUPPORTED: 'Validação assíncrona não é suportada.',
  BODY_MUST_BE_AN_OBJECT: 'O corpo da requisição deve ser um objeto.',
  CALLBACK_URL_REQUIRED: 'A URL de callback é obrigatória.',
  CREDENTIAL_ACCOUNT_NOT_FOUND: 'Conta de credenciais não encontrada.',
  CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: 'Login bloqueado por navegação entre sites.',
  EMAIL_ALREADY_VERIFIED: 'E-mail já verificado.',
  EMAIL_CAN_NOT_BE_UPDATED: 'E-mail não pode ser atualizado.',
  EMAIL_MISMATCH: 'E-mail não corresponde.',
  EMAIL_NOT_VERIFIED: 'E-mail não verificado.',
  FAILED_TO_CREATE_SESSION: 'Falha ao criar sessão.',
  FAILED_TO_CREATE_USER: 'Falha ao criar usuário.',
  FAILED_TO_CREATE_VERIFICATION: 'Falha ao criar verificação.',
  FAILED_TO_GET_SESSION: 'Falha ao obter sessão.',
  FAILED_TO_GET_USER_INFO: 'Falha ao obter informações do usuário.',
  FAILED_TO_UNLINK_LAST_ACCOUNT: 'Você não pode desvincular sua última conta.',
  FAILED_TO_UPDATE_USER: 'Falha ao atualizar usuário.',
  FIELD_NOT_ALLOWED: 'Campo não permitido.',
  ID_TOKEN_NOT_SUPPORTED: 'id_token não é suportado.',
  INVALID_CALLBACK_URL: 'URL de callback inválida.',
  INVALID_EMAIL: 'E-mail inválido.',
  INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha inválidos.',
  INVALID_ERROR_CALLBACK_URL: 'URL de callback de erro inválida.',
  INVALID_NEW_USER_CALLBACK_URL: 'URL de callback de novo usuário inválida.',
  INVALID_ORIGIN: 'Origem inválida.',
  INVALID_PASSWORD: 'Senha inválida.',
  INVALID_REDIRECT_URL: 'URL de redirecionamento inválida.',
  INVALID_TOKEN: 'Token inválido.',
  INVALID_USER: 'Usuário inválido.',
  LINKED_ACCOUNT_ALREADY_EXISTS: 'Conta vinculada já existe.',
  METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED: 'Método não permitido. deferSession é obrigatório.',
  MISSING_FIELD: 'Campo obrigatório ausente.',
  MISSING_OR_NULL_ORIGIN: 'Origem ausente ou nula.',
  PASSWORD_ALREADY_SET: 'Senha já definida.',
  PASSWORD_TOO_LONG: 'Senha muito longa.',
  PASSWORD_TOO_SHORT: 'Senha muito curta.',
  PROVIDER_NOT_FOUND: 'Provedor não encontrado.',
  SESSION_EXPIRED: 'Sessão expirada. Reautentique para realizar esta ação.',
  SESSION_NOT_FRESH: 'Sessão não é recente. Reautentique para continuar.',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'Conta social já vinculada.',
  TOKEN_EXPIRED: 'Token expirado.',
  USER_ALREADY_EXISTS: 'Usuário já existe.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Usuário já existe.',
  USER_ALREADY_HAS_PASSWORD: 'O usuário já possui uma senha. Forneça-a para excluir a conta.',
  USER_EMAIL_NOT_FOUND: 'E-mail do usuário não encontrado.',
  USER_NOT_FOUND: 'Usuário não encontrado.',
  VALIDATION_ERROR: 'Erro de validação.',
  VERIFICATION_EMAIL_NOT_ENABLED: 'A verificação por e-mail não está habilitada.',
}

type AdminAllErrorCode = keyof ReturnType<typeof admin<never>>['$ERROR_CODES']
type AdminOnlyErrorCode = Exclude<AdminAllErrorCode, BaseAuthErrorCode>

const adminErrors: Record<AdminOnlyErrorCode, string> = {
  BANNED_USER: 'Usuário banido.',
  INVALID_ROLE_TYPE: 'Tipo de papel inválido.',
  NO_DATA_TO_UPDATE: 'Nenhum dado para atualizar.',
  YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: 'Você não tem permissão para banir usuários.',
  YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE:
    'Você não tem permissão para alterar o papel dos usuários.',
  YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: 'Você não tem permissão para criar usuários.',
  YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: 'Você não tem permissão para excluir usuários.',
  YOU_ARE_NOT_ALLOWED_TO_GET_USER: 'Você não tem permissão para obter este usuário.',
  YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: 'Você não tem permissão para personificar usuários.',
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: 'Você não tem permissão para listar usuários.',
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS:
    'Você não tem permissão para listar as sessões dos usuários.',
  YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS:
    'Você não tem permissão para revogar as sessões dos usuários.',
  YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE:
    'Você não tem permissão para definir um valor que não existe.',
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD:
    'Você não tem permissão para definir a senha dos usuários.',
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: 'Você não tem permissão para atualizar usuários.',
  YOU_CANNOT_BAN_YOURSELF: 'Você não pode banir a si mesmo.',
  YOU_CANNOT_IMPERSONATE_ADMINS: 'Você não pode personificar administradores.',
  YOU_CANNOT_REMOVE_YOURSELF: 'Você não pode remover a si mesmo.',
}

export const translatedErrorMessages = {
  ...baseErrors,
  ...adminErrors,
}
