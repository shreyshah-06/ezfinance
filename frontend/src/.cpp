#include <bits/stdc++.h>

using namespace std;

void dfs(){

}

int main(){
    int n,m;
    cin>>n>>m;
    vector <vector <int>> g(n+4);
    map <int,int> mp;
    map <int,int> freq;
    int k=0;
    for(int i=0;i<m;i++){
        int y;
        cin>>y;
        vector <int> v;
        for(int u=0;u<y;u++){
            int h;
            cin>>h;
            v.push_back(h);
        }
        int flag=0;
        for(int i=0;i<y;i++){
            if(mp[v[i]]){
                flag=v[i];
                break;
            }
        }
        if(flag){
            for(auto d:v){
                mp[d]=flag;
            }
        }
    }
    
    for(int i=0;i<n;i++){
        int groups=mp[i];
        cout<<freq[groups]<<" ";
    }
    cout<<endl;
}