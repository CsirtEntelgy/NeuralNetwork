package com.gg.borsaneurale;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.navigation.fragment.NavHostFragment;

import com.gg.borsaneurale.databinding.FragmentSecondBinding;
import com.gg.persistence.Azione;

public class SecondFragment extends Fragment {

    public Azione azione;
    private FragmentSecondBinding binding;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        azione = Azione.mappaAzioni.get(getArguments().getString("azione"));
        binding = FragmentSecondBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        binding.azName.setText(azione.name);
        binding.azSigla.setText(azione.sigla);
        binding.azAgg.setText(azione.ultimoAggiornamento);
        azione.loadDati(this.getContext());
        binding.azGraph.setPoints(azione.getDati());
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

}