package com.gg.borsaneurale;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;

import androidx.navigation.fragment.NavHostFragment;

import com.gg.borsaneurale.databinding.FragmentFirstBinding;
import com.gg.persistence.Azione;
import com.gg.ui.AzioniAdapter;

public class FirstFragment extends Fragment {

    AzioniAdapter adapter;
    private FragmentFirstBinding binding;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        adapter = new AzioniAdapter(this.getContext());
        binding = FragmentFirstBinding.inflate(inflater, container, false);
        ArrayAdapter<Azione> adapter1 = new ArrayAdapter<Azione>(this.getContext(), R.layout.azione_row, adapter.azioni);
        binding.idListaAzioni.setAdapter(adapter1);
        return binding.getRoot();

    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        binding.idListaAzioni.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Bundle args = new Bundle();
                args.putString("azione", adapter.getItem(position).toString());
                setArguments(args);
                NavHostFragment.findNavController(FirstFragment.this)
                        .navigate(R.id.action_FirstFragment_to_ThirdFragment, args);

            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

}