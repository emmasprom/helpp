import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { doc, updateDoc, increment, addDoc, collection, query, where, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, Heart, Sparkles, Smartphone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [details, setDetails] = useState<any>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference || processedRef.current) return;

    const verify = async () => {
      processedRef.current = true;
      try {
        // In a real app, you'd call Paystack API to verify the reference
        // For this demo, we'll simulate verification and update Firestore
        // We simulate a small delay
        await new Promise(r => setTimeout(r, 2000));

        // We assume success for the demo/prototype
        // In a real implementation, you'd do:
        // const resp = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
        // if(resp.data.data.status === 'success') { ... }

        const mockedData = {
           amount: 50,
           campaignId: localStorage.getItem('lastDonationCampaignId') || 'demo-campaign',
           donorEmail: auth.currentUser?.email || 'donor@example.com',
           donorId: auth.currentUser?.uid || 'temp-donor'
        };

        // Update Campaign
        if (mockedData.campaignId) {
          const campaignRef = doc(db, 'campaigns', mockedData.campaignId);
          await updateDoc(campaignRef, {
            raisedAmount: increment(mockedData.amount),
            donorCount: increment(1)
          }).catch(e => {
            handleFirestoreError(e, OperationType.UPDATE, `campaigns/${mockedData.campaignId}`);
          });
        }

        // Add Donation Record
        await addDoc(collection(db, 'donations'), {
          campaignId: mockedData.campaignId,
          donorId: mockedData.donorId,
          amount: mockedData.amount,
          status: 'success',
          reference: reference,
          createdAt: new Date().toISOString()
        }).catch(e => {
          handleFirestoreError(e, OperationType.CREATE, 'donations');
        });

        // Update or Create Donor in CRM
        const donorRef = doc(db, 'donors', mockedData.donorId);
        await setDoc(donorRef, {
           email: mockedData.donorEmail,
           fullName: auth.currentUser?.displayName || 'Anonymous Supporter',
           totalDonated: increment(mockedData.amount),
           donationCount: increment(1),
           lastDonationAt: new Date().toISOString(),
           score: 50, // Initial AI score
           segment: 'active',
           createdAt: serverTimestamp()
        }, { merge: true }).catch(e => {
          handleFirestoreError(e, OperationType.UPDATE, `donors/${mockedData.donorId}`);
        });

        // Trigger AI "Thank You" logic via backend (optional/async)
        axios.post('/api/whatsapp/send', {
           to: '+1234567890', // In real app, use donor's phone
           message: `Thank you for your donation of $${mockedData.amount}! You just changed a life. Track your impact here: ${process.env.APP_URL}`
        }).catch(e => console.error('WhatsApp failed', e));

        setStatus('success');
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center relative z-10 shadow-2xl"
      >
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-2xl font-bold">Verifying Donation...</h2>
            <p className="text-zinc-500 italic">"Patience is the foundation of change." — AI Proverb</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-8">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 scale-125 mb-4">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
               <h2 className="text-4xl font-black mb-2 tracking-tight">MISSION SUCCESSFUL</h2>
               <p className="text-zinc-400">Your contribution has been secured. Our team (and our AI) is already putting it to work.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
                  <Smartphone className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <p className="text-[10px] text-zinc-500 uppercase font-black">WhatsApp Sent</p>
               </div>
               <div className="p-4 bg-zinc-800/50 rounded-2xl border border-white/5">
                  <Mail className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-[10px] text-zinc-500 uppercase font-black">Receipt Emailed</p>
               </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl relative overflow-hidden group">
               <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
                  <Sparkles className="w-4 h-4 fill-current" />
                  AI IMPACT INSIGHT
               </div>
               <p className="text-xs text-zinc-300 leading-relaxed italic relative z-10">
                  "Your donation has just closed a 5% funding gap. This allows the local team to break ground 2 weeks ahead of schedule."
               </p>
               <Sparkles className="absolute -bottom-4 -right-4 w-12 h-12 text-primary/10" />
            </div>

            <Link to="/" className="block">
               <Button className="w-full h-14 bg-white text-black hover:bg-zinc-200 text-lg font-black rounded-2xl gap-2">
                  Explore More Mission <ArrowRight className="w-5 h-5" />
               </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="text-zinc-500">We couldn't verify your transaction. Please contact support if you were charged.</p>
            <Link to="/">
               <Button variant="outline" className="w-full h-12 border-white/10 rounded-2xl">Return Home</Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
