import React, { useState } from 'react';
import { NO_AUTOFILL_PROPS } from '../grid/constants';
import { loginAccount, verifyTwoFaCode, type AuthSession } from '../../services/b2bAuth';
import { AdvButton } from '../ui/AdvButton';
import {
  CONTROL_INPUT_MD_CLASS,
} from '../ui/controlFocus';

export interface LoginPanelProps {
  onSuccess: (session: AuthSession) => void;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({ onSuccess }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!account.trim() || !password) {
      setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const session = await loginAccount(account, password);
      if (session.Requires2FA && session.ChallengeId) {
        setChallengeId(session.ChallengeId);
        return;
      }
      onSuccess(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2Fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !challengeId) return;
    if (!twoFaCode.trim()) {
      setError('Vui lòng nhập mã xác thực 2 bước.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const session = await verifyTwoFaCode(challengeId, twoFaCode);
      onSuccess(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực không thành công.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex-1 flex items-center justify-center p-4 bg-background text-foreground">
      <div className="agv-login-card w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
        <div className="mb-5">
          <h1 className="text-section-title font-semibold text-foreground tracking-tight">
            Kết nối dữ liệu B2B-PNT
          </h1>
          <p className="mt-1 text-label text-muted-foreground">
            Đăng nhập để xem và tra cứu Quốc gia, Sân bay, Đại lý trên GridV3.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mb-4 rounded-md border border-status-danger-border bg-status-danger text-status-danger-foreground px-3 py-2 text-xs font-medium"
          >
            {error}
          </div>
        ) : null}

        {challengeId ? (
          <form onSubmit={handleVerify2Fa} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="b2b-2fa-code"
                className="block text-label font-medium text-foreground"
              >
                Mã xác thực 2 bước
              </label>
              <input
                id="b2b-2fa-code"
                type="text"
                value={twoFaCode}
                onChange={(e) => setTwoFaCode(e.target.value)}
                placeholder="Nhập mã OTP"
                {...NO_AUTOFILL_PROPS}
                className={`w-full px-3 ${CONTROL_INPUT_MD_CLASS}`}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <AdvButton
                variant="outline"
                size="default"
                disabled={loading}
                onClick={() => {
                  setChallengeId(null);
                  setTwoFaCode('');
                  setError('');
                }}
              >
                Quay lại
              </AdvButton>
              <AdvButton
                type="submit"
                variant="default"
                size="default"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Đang xác thực...' : 'Xác nhận'}
              </AdvButton>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="b2b-account"
                className="block text-label font-medium text-foreground"
              >
                Tài khoản
              </label>
              <input
                id="b2b-account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Nhập tên đăng nhập hoặc email"
                {...NO_AUTOFILL_PROPS}
                className={`w-full px-3 ${CONTROL_INPUT_MD_CLASS}`}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="b2b-password"
                  className="block text-label font-medium text-foreground"
                >
                  Mật khẩu
                </label>
                <AdvButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="px-2 text-brand"
                >
                  {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                </AdvButton>
              </div>
              <input
                id="b2b-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                {...NO_AUTOFILL_PROPS}
                className={`w-full px-3 ${CONTROL_INPUT_MD_CLASS}`}
              />
            </div>

            <AdvButton
              type="submit"
              variant="default"
              size="default"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </AdvButton>
          </form>
        )}
      </div>
    </div>
  );
};
